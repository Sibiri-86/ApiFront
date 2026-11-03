import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Account } from 'src/app/demo/components/model/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userIdentity: Account | null = null;
    private authenticated = false;
    private authorities: string[] = [];
    private authenticationState = new Subject<Account | null>();

    // Clés pour le localStorage
    private readonly USER_KEY = 'currentUser';
    private readonly AUTH_KEY = 'isAuthenticated';
    private readonly UTILISATEUR_KEY = 'UTILISATEUR_KEY';

    constructor(private http: HttpClient, private router: Router) {
        // Restaurer l'état lors de l'initialisation
        this.restoreAuthenticationState();
    }

    /* findAuthorities(): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>('api/account/authorities', { observe: 'response' });
    } */

    fetch(): Observable<HttpResponse<Account>> {
        return this.http.get<Account>('/users/account', { observe: 'response' }).pipe(
            tap(response => {
                if (response.body) {
                    this.authenticate(response.body);
                }
            })
        );
    }
    
    updatePassword(newPassword: string, currentPassword: string): Observable<any> {
        console.log('Updating password...');
        return this.http.post('/users/account/change-password', { currentPassword, newPassword });
    }

    reinitialize(email: string, currentPassword: string): Observable<any> {
        return this.http.post('/users/account/reinitialize', { email, currentPassword });
    }

    save(account: Account): Observable<HttpResponse<any>> {
        return this.http.post('/account', account, { observe: 'response' });
    }

    authenticate(identity: Account | null): void {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authorities = identity?.authorities || [];
        this.authenticationState.next(this.userIdentity);
        
        // Sauvegarder dans le localStorage
        if (identity) {
            this.saveAuthenticationState(identity);
        } else {
            this.clearAuthenticationState();
        }
    }

    // Sauvegarder l'état dans le localStorage
    private saveAuthenticationState(account: Account): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(account));
        localStorage.setItem(this.UTILISATEUR_KEY, JSON.stringify(account));
        localStorage.setItem(this.AUTH_KEY, 'true');
    }

    // Restaurer l'état depuis le localStorage et rafraîchir depuis le serveur
    private restoreAuthenticationState(): void {
        const storedUser = localStorage.getItem(this.USER_KEY);
        const isAuth = localStorage.getItem(this.AUTH_KEY);


        if (storedUser && isAuth === 'true') {
            try {
                // Restaurer temporairement depuis le localStorage
                this.userIdentity = JSON.parse(storedUser);
                this.authenticated = true;
                this.authorities = this.userIdentity?.authorities || [];
                this.authenticationState.next(this.userIdentity);

                // Rafraîchir immédiatement depuis le serveur pour avoir les données à jour
                this.refreshUserData();
            } catch (error) {
                console.error('Error restoring authentication state:', error);
                this.clearAuthenticationState();
            }
        }
    }

    // Méthode pour rafraîchir les données utilisateur depuis le serveur
    private refreshUserData(): void {
        this.fetch().pipe(
            catchError(error => {
                console.error('Error refreshing user data:', error);
                // En cas d'erreur, garder les données en cache
                return of(null);
            })
        ).subscribe(response => {
            if (response?.body) {
                console.log('User data refreshed with updated authorities');
            }
        });
    }

    // Méthode publique pour forcer le refresh des données utilisateur
    public forceRefreshUserData(): Observable<Account | null> {
        return this.fetch().pipe(
            map(response => response?.body || null),
            catchError(error => {
                console.error('Error forcing refresh user data:', error);
                return of(null);
            })
        );
    }

    // Nettoyer le localStorage
    private clearAuthenticationState(): void {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.AUTH_KEY);
        localStorage.removeItem(this.UTILISATEUR_KEY);
    }

    hasAnyAuthority(authorities: string[]): boolean {
        if (!this.authenticated || !this.userIdentity?.authorities) {
            return false;
        }

        return authorities.some(authority => 
            this.userIdentity!.authorities.includes(authority)
        );
    }

    hasAuthority(authority: string): Observable<boolean> {
        return this.identity().pipe(
            map(identity => identity?.authorities?.includes(authority) || false),
            catchError(() => of(false))
        );
    }

    hasRole(authority: string): boolean {
        if (!this.authenticated || !this.userIdentity) {
            return false;
        }
        return this.userIdentity.authorities?.includes(authority) || false;
    }

    checkAuthentication(): Observable<boolean> {
        return this.identity().pipe(
            map(identity => identity !== null),
            catchError(() => of(false))
        );
    }

    identity(force?: boolean): Observable<Account | null> {
        if (force) {
            this.userIdentity = null;
            this.clearAuthenticationState();
        }

        // Retourner l'identité en cache si elle existe
        if (this.userIdentity && !force) {
            return of(this.userIdentity);
        }

        // Si on a des données en localStorage, les utiliser temporairement
        const storedUser = localStorage.getItem(this.USER_KEY);
        if (storedUser && !force) {
            try {
                this.userIdentity = JSON.parse(storedUser);
                this.authenticated = true;
                this.authorities = this.userIdentity?.authorities || [];
                
                // Rafraîchir les données en arrière-plan
                this.refreshUserData();
                
                return of(this.userIdentity);
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
        }

        // Sinon, fetch depuis le serveur
        return this.fetch().pipe(
            map(response => {
                if (!response?.body) {
                    this.resetAuthenticationState();
                }
                return this.userIdentity;
            }),
            catchError(error => {
                console.error('Error fetching user identity:', error);
                this.resetAuthenticationState();
                this.router.navigate(['/admin/login']);
                return of(null);
            })
        );
    }

    private resetAuthenticationState(): void {
        this.userIdentity = null;
        this.authenticated = false;
        this.authorities = [];
        this.authenticationState.next(null);
        this.clearAuthenticationState();
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    isIdentityResolved(): boolean {
        return this.userIdentity !== undefined;
    }

    getAuthenticationState(): Observable<Account | null> {
        return this.authenticationState.asObservable();
    }

    getImageUrl(): string {
        return this.userIdentity?.imageUrl || '';
    }

    getCurrentUser(): Account | null {
        return this.userIdentity;
    }

    getUserAuthorities(): string[] {
        return this.authorities;
    }

    logout(): void {
        this.resetAuthenticationState();
        this.router.navigate(['/admin/login']);
    }
}