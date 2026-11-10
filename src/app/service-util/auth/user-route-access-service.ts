import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StateStorageService } from './state-storage.service';
import { AuthServerProvider } from './auth-jwt.service';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class UserRouteAccessService implements CanActivate {
    /** Page affichée quand l'utilisateur n'a pas les droits */
    private readonly ACCESS_DENIED_URL = '/not-found';

    constructor(
        private router: Router,
        private stateStorageService: StateStorageService,
        private authServerProvider: AuthServerProvider,
        private accountService: AccountService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        // 1. Authentification : jeton présent et non expiré
        if (!this.authServerProvider.isAuthenticated()) {
            console.warn('Jeton absent ou expiré - redirection vers le login');
            this.stateStorageService.storeUrl(state.url);
            this.authServerProvider.logout();
            return of(false);
        }

        const requiredAuthorities: string[] = route.data['authorities'];

        // 2. On attend que l'identité (et ses droits) soit chargée
        return this.accountService.identity().pipe(
            map((account) => {
                if (!account) {
                    this.authServerProvider.logout();
                    return false;
                }

                // Route sans restriction : tout utilisateur connecté
                if (!requiredAuthorities || requiredAuthorities.length === 0) {
                    return true;
                }

                if (this.accountService.hasAnyAuthority(requiredAuthorities)) {
                    return true;
                }

                if (isDevMode()) {
                    console.error(
                        'Droits requis (un parmi) :', requiredAuthorities,
                        '- droits utilisateur :', this.accountService.getUserAuthorities()
                    );
                }
                this.router.navigate([this.ACCESS_DENIED_URL]);
                return false;
            }),
            catchError(() => {
                this.authServerProvider.logout();
                return of(false);
            })
        );
    }
}
