import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { AuthServerProvider } from './auth-jwt.service';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { User } from 'src/app/store/user/model';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class LoginService {
    constructor(
        private accountService: AccountService, 
        private authServerProvider: AuthServerProvider,
        private router: Router,
        private messageService: MessageService
    ) {}

    login(credentials: any): Observable<any> {
        return this.authServerProvider.login(credentials).pipe(
            tap((response: any) => {
                console.log('✅ Données de connexion reçues:', response);
            }),
          catchError((error) => {
                console.error('❌ Erreur lors de la connexion:', error);
                this.logout();
                return throwError(() => error);
            })
        );
    }

    /**
     * Déconnecte l'utilisateur
     * @param showMessage - Afficher un message de notification (défaut: false)
     * @param customMessage - Message personnalisé (optionnel)
     */
    logout(showMessage: boolean = false, customMessage?: string): void {
        try {
            console.log('🚪 Déconnexion de l\'utilisateur');
            
            // Déconnexion via AuthServerProvider (gère tout le nettoyage)
            this.authServerProvider.logout();
            
            // Réinitialiser l'état d'authentification dans AccountService
            this.accountService.authenticate(null);
            
            // Supprimer les données utilisateur du localStorage
            localStorage.removeItem('UTILISATEUR_KEY');
            
            // Afficher un message si demandé
            if (showMessage) {
                const message = customMessage || 'Vous avez été déconnecté';
                this.showLogoutMessage(message);
            }
            
            // Rediriger vers la page de connexion
            this.router.navigate(['/admin/login'], {
                queryParams: { reason: showMessage ? 'session-expired' : 'logout' }
            });
            
            console.log('✅ Déconnexion effectuée avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
            // Forcer la redirection même en cas d'erreur
            this.router.navigate(['/admin/login']);
        }
    }

    /**
     * Affiche un message de déconnexion
     * @param message - Le message à afficher
     */
    private showLogoutMessage(message: string): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'Session expirée',
            detail: message,
            life: 5000,
            key: 'session-expired'
        });
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isAuthenticated(): boolean {
        return this.authServerProvider.isAuthenticated();
    }

    /**
     * Observable pour surveiller l'état d'authentification
     */
    get isAuthenticated$(): Observable<boolean> {
        return this.authServerProvider.isAuthenticated$;
    }

    /**
     * Récupère l'utilisateur stocké dans le localStorage
     */
    getStoredUser(): User | null {
        const userJson = localStorage.getItem('UTILISATEUR_KEY');
        return userJson ? JSON.parse(userJson) as User : null;
    }

    /**
     * Récupère les informations de l'utilisateur connecté
     */
    getCurrentUser(): any {
        return this.authServerProvider.getUserInfo();
    }

    

    /**
     * Récupère le token d'accès stocké
     */
    getStoredAuthenticationToken(): string | null {
        return this.authServerProvider.getAccessToken();
    }

    

    /**
     * Génère les en-têtes d'authentification
     */
    getAuthHeaders() {
        return this.authServerProvider.getAuthHeaders();
    }

    /**
     * ====================================================================
     * NOUVELLE MÉTHODE - Demande de réinitialisation du mot de passe
     * ====================================================================
     * Envoie une demande de réinitialisation de mot de passe.
     * Un email sera envoyé à l'utilisateur avec un lien de réinitialisation.
     * 
     * @param matricule - Le matricule de l'utilisateur
     * @returns Observable contenant la réponse du serveur
     */
    resetPassword(matricule: string): Observable<any> {
        return this.authServerProvider.resetPassword(matricule).pipe(
            tap((response: any) => {
                console.log('✅ Demande de réinitialisation envoyée:', response);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Email envoyé',
                    detail: 'Un email de réinitialisation a été envoyé à votre adresse.',
                    life: 5000
                });
            }),
            catchError((error) => {
                console.error('❌ Erreur lors de la demande de réinitialisation:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible d\'envoyer l\'email de réinitialisation.',
                    life: 5000
                });
                return throwError(() => error);
            })
        );
    }

    /**
     * ====================================================================
     * NOUVELLE MÉTHODE - Confirmation de réinitialisation du mot de passe
     * ====================================================================
     * Confirme la réinitialisation du mot de passe avec le token reçu par email.
     * 
     * @param key - Le token de réinitialisation reçu par email
     * @param newPassword - Le nouveau mot de passe
     * @returns Observable contenant la réponse du serveur
     */
    confirmResetPassword(key: string, newPassword: string): Observable<any> {
        return this.authServerProvider.confirmResetPassword(key, newPassword).pipe(
            tap((response: any) => {
                console.log('✅ Mot de passe réinitialisé avec succès:', response);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Votre mot de passe a été réinitialisé avec succès.',
                    life: 5000
                });
            }),
            catchError((error) => {
                console.error('❌ Erreur lors de la confirmation de réinitialisation:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de réinitialiser le mot de passe. Le lien est peut-être expiré.',
                    life: 5000
                });
                return throwError(() => error);
            })
        );
    }

    /**
     * ====================================================================
     * MÉTHODE UTILITAIRE - Nettoyer la session utilisateur
     * ====================================================================
     * Nettoie toutes les données de session sans redirection
     * Utile pour les cas où on veut juste nettoyer sans déconnecter
     */
    clearSession(): void {
        console.log('🧹 Nettoyage de la session');
        localStorage.removeItem('UTILISATEUR_KEY');
        this.accountService.authenticate(null);
    }
}