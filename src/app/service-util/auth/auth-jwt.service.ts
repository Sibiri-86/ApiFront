import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

/** Format de réponse du backend Spring Boot */
interface ApiResponse<T = any> {
  ENTETE: { CODEERREUR: number; MESSAGE: string };
  RESULTAT: T;
}

export interface LoginCredentials {
  login: string;
  password: string;
  rememberMe?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  private readonly API = '';
  private readonly ACCESS_TOKEN_KEY = 'accessToken';

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private router: Router
  ) {
    // Initialisé ici (et non en propriété) pour garantir que les services injectés sont disponibles
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  // ============================================================================
  // Authentification
  // ============================================================================

  /**
   * Authentifie l'utilisateur.
   * Le backend répond en HTTP 200 avec { ENTETE: {CODEERREUR, MESSAGE}, RESULTAT: {JETON} }.
   */
  login(credentials: LoginCredentials): Observable<ApiResponse<{ JETON: string }>> {
    const data = {
      LOGIN: credentials.login,
      MOTDEPASSE: credentials.password,
    };

    return this.http.post<ApiResponse<{ JETON: string }>>(`${this.API}/users/login`, data).pipe(
      tap((response) => {
        const code = response?.ENTETE?.CODEERREUR;
        const jeton = response?.RESULTAT?.JETON;

        if (code === 200 && jeton) {
          this.setToken(jeton, credentials.rememberMe ?? false);
        } else {
          // Erreur métier renvoyée avec un HTTP 200
          throw new Error(response?.ENTETE?.MESSAGE || 'Échec de la connexion');
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la connexion:', error);
        return throwError(() => error);
      })
    );
  }

  /** Déconnecte l'utilisateur (purement côté client : pas de refresh token côté backend) */
  logout(): void {
    this.clearTokens();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  // ============================================================================
  // Gestion du jeton
  // ============================================================================

  /** Stocke le jeton : localStorage si "se souvenir de moi", sinon sessionStorage */
  setToken(token: string, rememberMe: boolean = false): void {
    this.clearTokens();
    if (rememberMe) {
      this.localStorage.store(this.ACCESS_TOKEN_KEY, token);
    } else {
      this.sessionStorage.store(this.ACCESS_TOKEN_KEY, token);
    }
    this.isAuthenticatedSubject.next(true);
  }

  getAccessToken(): string | null {
    return (
      this.localStorage.retrieve(this.ACCESS_TOKEN_KEY) ||
      this.sessionStorage.retrieve(this.ACCESS_TOKEN_KEY) ||
      null
    );
  }

  private clearTokens(): void {
    this.localStorage.clear(this.ACCESS_TOKEN_KEY);
    this.sessionStorage.clear(this.ACCESS_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /** En-têtes HTTP avec le jeton (utile si tu n'utilises pas d'interceptor) */
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Vérifie la présence et la validité du jeton.
   * - JWT avec "exp" : on vérifie l'expiration (marge de 30 s).
   * - Jeton non JWT ou sans "exp" : on l'accepte tant qu'il n'est pas vide
   *   (le serveur reste l'autorité et répondra 401 s'il est invalide).
   */
  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    const payload = this.decodePayload(token);
    if (!payload || typeof payload.exp !== 'number') {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const isValid = payload.exp > now + 30;

    if (!isValid) {
      console.warn('Token expiré :', new Date(payload.exp * 1000));
      this.clearTokens();
    }
    return isValid;
  }

  /** Décode le payload d'un JWT (base64url + UTF-8). Retourne null si ce n'est pas un JWT. */
  private decodePayload(token: string): any | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(json);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /** Informations de l'utilisateur lues dans le JWT */
  getUserInfo(): any {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    const payload = this.decodePayload(token);
    if (!payload) {
      return null;
    }
    return {
      userId: payload.sub,
      username: payload.username || payload.login,
      email: payload.email,
      roles: payload.roles || [],
      exp: payload.exp,
    };
  }

  // ============================================================================
  // Réinitialisation du mot de passe
  // ============================================================================

  /** Demande de réinitialisation du mot de passe à partir du matricule */
  resetPassword(matricule: string): Observable<any> {
    return this.http.post(`${this.API}/users/reset-password/init`, { matricule }).pipe(
      tap(() => console.log('Demande de réinitialisation envoyée pour:', matricule)),
      catchError((error) => {
        console.error('Erreur lors de la demande de réinitialisation:', error);
        return throwError(() => error);
      })
    );
  }

  /** Confirmation de la réinitialisation avec la clé reçue par email */
  confirmResetPassword(key: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API}/users/reset-password/finish`, { key, newPassword }).pipe(
      tap(() => console.log('Mot de passe réinitialisé avec succès')),
      catchError((error) => {
        console.error('Erreur lors de la confirmation de réinitialisation:', error);
        return throwError(() => error);
      })
    );
  }
}