// src/app/core/auth/idle-timeout.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, fromEvent, merge, timer, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { LoginService } from './login.service';
import { AuthServerProvider } from './auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class IdleTimeoutService {
    // Configuration : 5 minutes d'inactivité
    private idleTime = 10 * 60 * 1000; // 10 minutes en millisecondes
    private warningTime = 4 * 60 * 1000; // Avertir 1 minute avant (à 4 minutes)
    
    private idleTimer?: Subscription;
    private warningTimer?: Subscription;
    private activitySubscription?: Subscription;
    
    private idle$ = new Subject<boolean>();
    private warning$ = new Subject<boolean>();
    
    // Observables publics pour écouter les événements
    public onIdle$ = this.idle$.asObservable();
    public onWarning$ = this.warning$.asObservable();
    
    private isIdleTimerActive = false;

    constructor(
        private ngZone: NgZone,
        private router: Router,
        private loginService: LoginService,
    ) {}

    /**
     * Démarre la surveillance de l'inactivité
     */
    startWatching(): void {
        if (this.isIdleTimerActive) {
            console.log('⚠️ Surveillance déjà active, ignoré');
            return;
        }

        console.log('🔍 Démarrage de la surveillance d\'inactivité (5 minutes)');
        this.isIdleTimerActive = true;

        // Écouter tous les événements d'activité utilisateur
        const activityEvents$ = merge(
            fromEvent(document, 'click'),
            fromEvent(document, 'keydown'),
            fromEvent(document, 'keypress'),
            fromEvent(document, 'mousemove'),
            fromEvent(document, 'mousedown'),
            fromEvent(document, 'touchstart'),
            fromEvent(document, 'touchmove'),
            fromEvent(document, 'scroll'),
            fromEvent(window, 'resize')
        );

        // Débouncer les événements pour éviter trop d'appels
        this.activitySubscription = activityEvents$.pipe(
            debounceTime(1000), // Ignorer les événements qui arrivent dans la même seconde
            tap(() => {
                console.log('👆 Activité détectée - Reset du timer');
                this.resetTimer();
            })
        ).subscribe();

        // Démarrer le timer initial
        this.resetTimer();
    }

    /**
     * Arrête la surveillance de l'inactivité
     */
    stopWatching(): void {
        console.log('⏹️ Arrêt de la surveillance d\'inactivité');
        this.isIdleTimerActive = false;
        
        this.clearTimers();
        
        if (this.activitySubscription) {
            this.activitySubscription.unsubscribe();
            this.activitySubscription = undefined;
        }
    }

    /**
     * Réinitialise le timer d'inactivité
     */
    private resetTimer(): void {
        if (!this.isIdleTimerActive) {
            return;
        }

        this.clearTimers();

        // Exécuter les timers en dehors de la zone Angular pour optimiser les performances
        this.ngZone.runOutsideAngular(() => {
            // Timer pour l'avertissement (4 minutes)
            this.warningTimer = timer(this.warningTime).subscribe(() => {
                this.ngZone.run(() => {
                    console.warn('⚠️ Inactivité détectée - Avertissement (1 minute restante)');
                    this.warning$.next(true);
                });
            });

            // Timer pour l'expiration (5 minutes)
            this.idleTimer = timer(this.idleTime).subscribe(() => {
                this.ngZone.run(() => {
                    console.error('❌ Session expirée après 5 minutes d\'inactivité');
                    this.handleIdleTimeout();
                });
            });
        });
    }

    /**
     * Gère l'expiration de la session par inactivité
     */
    private handleIdleTimeout(): void {
        this.idle$.next(true);
        this.stopWatching();
        
        // Déconnecter l'utilisateur
        this.loginService.logout(true, 'Votre session a expiré après 5 minutes d\'inactivité');
    }

    /**
     * Nettoie les timers
     */
    private clearTimers(): void {
        if (this.warningTimer) {
            this.warningTimer.unsubscribe();
            this.warningTimer = undefined;
        }
        
        if (this.idleTimer) {
            this.idleTimer.unsubscribe();
            this.idleTimer = undefined;
        }
    }

    /**
     * Permet de rester actif manuellement (après confirmation utilisateur)
     */
    keepAlive(): void {
        console.log('✅ Utilisateur a confirmé rester actif');
        this.resetTimer();
        this.warning$.next(false);
    }

    /**
     * Obtient le temps d'inactivité configuré
     */
    getIdleTime(): number {
        return this.idleTime;
    }

    /**
     * Change le temps d'inactivité (utile pour les tests)
     */
    setIdleTime(milliseconds: number): void {
        this.idleTime = milliseconds;
        this.warningTime = milliseconds - (60 * 1000); // 1 minute avant
        
        console.log(`⏱️ Temps d'inactivité modifié: ${milliseconds / 1000} secondes`);
        
        if (this.isIdleTimerActive) {
            this.resetTimer();
        }
    }

    /**
     * Vérifie si la surveillance est active
     */
    isWatching(): boolean {
        return this.isIdleTimerActive;
    }
}