import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { StateStorageService } from './state-storage.service';
import { AuthServerProvider } from './auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessService implements CanActivate {
    /** Page affichée quand l'utilisateur n'a pas les droits (à remplacer par une route 'accessdenied' si tu en crées une) */
    private readonly ACCESS_DENIED_URL = '/not-found';

    constructor(
        private router: Router,
        private stateStorageService: StateStorageService,
        private authServerProvider: AuthServerProvider
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // 1. Authentification : jeton présent et non expiré (aucun appel au backend)
        if (!this.authServerProvider.isAuthenticated()) {
            console.warn('Jeton absent ou expiré - redirection vers le login');
            this.stateStorageService.storeUrl(state.url);
            // Nettoie le stockage et redirige vers /admin/login
            this.authServerProvider.logout();
            return false;
        }

        // 2. Autorisations : seulement si la route en exige (data.authorities)
        const requiredAuthorities: string[] = route.data['authorities'];
        if (!requiredAuthorities || requiredAuthorities.length === 0) {
            return true;
        }

        const userAuthorities = this.getUserAuthorities();
        const hasAnyAuthority = requiredAuthorities.some((a) => userAuthorities.includes(a));

        if (hasAnyAuthority) {
            return true;
        }

        if (isDevMode()) {
            console.error('Droits requis (un parmi) :', requiredAuthorities, '- droits du jeton :', userAuthorities);
        }
        this.router.navigate([this.ACCESS_DENIED_URL]);
        return false;
    }

    /**
     * Droits de l'utilisateur lus dans le JWT.
     * Accepte un tableau ou une chaîne séparée par des virgules (ex. "UTILISATEUR,MODULE").
     */
    private getUserAuthorities(): string[] {
        const roles = this.authServerProvider.getUserInfo()?.roles;
        if (Array.isArray(roles)) {
            return roles;
        }
        if (typeof roles === 'string') {
            return roles.split(',').map((r) => r.trim()).filter(Boolean);
        }
        return [];
    }
}