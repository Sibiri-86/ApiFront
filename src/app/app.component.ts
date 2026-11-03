// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IdleTimeoutService } from './service-util/auth/idleTimeout.service';
import { AuthServerProvider } from './service-util/auth/auth-jwt.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { IdleWarningModalComponent } from './modules/idle-warning-modal/idle-warning-modal.component';
import { LoadingSpinnerComponent } from './modules/loading-spinner.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        IdleWarningModalComponent,
        ToastModule,
        LoadingSpinnerComponent
    ],
})
export class AppComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Routes publiques (pas besoin d'authentification)
    private readonly PUBLIC_ROUTES = [
        '/admin/login',
        '/admin/reset-password'
    ];

    constructor(
        private primengConfig: PrimeNGConfig,
        private router: Router,
        private idleTimeoutService: IdleTimeoutService,
        private authServerProvider: AuthServerProvider
    ) {}

    ngOnInit(): void {
        this.initializePrimeNG();
        this.initializeIdleTimeout();
        this.setupRouteListener();
    }

    ngOnDestroy(): void {
        console.log('🛑 Destruction de l\'application');
        this.destroy$.next();
        this.destroy$.complete();
        this.idleTimeoutService.stopWatching();
    }

    /**
     * Initialise la configuration PrimeNG
     */
    private initializePrimeNG(): void {
        this.primengConfig.ripple = true;
    }

    /**
     * Initialise la surveillance d'inactivité au démarrage
     */
    private initializeIdleTimeout(): void {
        console.log('🚀 Initialisation de l\'application');
        
        if (this.isAuthenticated()) {
            console.log('✅ Utilisateur connecté - Démarrage de la surveillance d\'inactivité');
            this.idleTimeoutService.startWatching();
        } else {
            console.log('❌ Utilisateur non connecté');
        }
    }

    /**
     * Configure l'écoute des changements de route
     */
    private setupRouteListener(): void {
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe((event: NavigationEnd) => {
            this.handleRouteChange(event.url);
        });
    }

    /**
     * Gère les changements de route et la surveillance d'inactivité
     * @param url URL de la route actuelle
     */
    private handleRouteChange(url: string): void {
        console.log('🔀 Navigation vers:', url);

        if (this.isPublicRoute(url)) {
            this.handlePublicRoute();
        } else if (this.isAuthenticated()) {
            this.handlePrivateRoute();
        } else {
            this.handleUnauthenticatedAccess();
        }
    }

    /**
     * Vérifie si la route est publique
     * @param url URL à vérifier
     * @returns true si la route est publique
     */
    private isPublicRoute(url: string): boolean {
        return this.PUBLIC_ROUTES.some(route => url.includes(route));
    }

    /**
     * Vérifie si l'utilisateur est authentifié
     * @returns true si l'utilisateur est authentifié
     */
    private isAuthenticated(): boolean {
        return this.authServerProvider.isAuthenticated();
    }

    /**
     * Gère l'accès à une route publique
     */
    private handlePublicRoute(): void {
        console.log('🔓 Page publique - Arrêt de la surveillance');
        this.idleTimeoutService.stopWatching();
    }

    /**
     * Gère l'accès à une route privée pour un utilisateur authentifié
     */
    private handlePrivateRoute(): void {
        console.log('🔒 Page privée - Démarrage de la surveillance');
        this.idleTimeoutService.startWatching();
    }

    /**
     * Gère l'accès non autorisé à une route privée
     */
    private handleUnauthenticatedAccess(): void {
        console.log('⚠️ Page privée mais utilisateur non authentifié - Redirection');
        this.router.navigate(['/admin/login']);
    }
}