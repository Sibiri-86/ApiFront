// idle-warning-modal.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { IdleTimeoutService } from 'src/app/service-util/auth/idleTimeout.service';
import { LoginService } from 'src/app/service-util/auth/login.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-idle-warning-modal',
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        ButtonModule
    ],
    template: `
        <p-dialog 
            [(visible)]="displayWarning" 
            [modal]="true" 
            [closable]="false"
            [draggable]="false"
            [resizable]="false"
            [style]="{width: '500px'}"
            styleClass="idle-warning-dialog"
            header="⚠️ Session sur le point d'expirer">
            
            <div class="warning-content">
                <p class="warning-message">
                    Votre session va expirer dans 
                    <strong class="countdown-text">{{ countdown }}</strong> 
                    seconde{{ countdown > 1 ? 's' : '' }} en raison d'inactivité.
                </p>
                <p class="question-text">Souhaitez-vous continuer votre session ?</p>
            </div>
            
            <ng-template pTemplate="footer">
                <p-button 
                    label="Oui, continuer" 
                    severity="success"
                    (onClick)="stayActive()"
                    icon="pi pi-check"
                    [style]="{marginRight: '0.5rem'}">
                </p-button>
                <p-button 
                    label="Non, se déconnecter" 
                    severity="danger"
                    (onClick)="logout()"
                    icon="pi pi-sign-out">
                </p-button>
            </ng-template>
        </p-dialog>
    `,
    styles: [`
        .warning-content {
            padding: 1.5rem 0;
        }
        
        .warning-message,
        .question-text {
            margin: 0.75rem 0;
            font-size: 1.05rem;
            line-height: 1.6;
        }
        
        .countdown-text {
            color: #d32f2f;
            font-size: 1.4em;
            font-weight: 700;
            animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { 
                opacity: 1;
                transform: scale(1);
            }
            50% { 
                opacity: 0.7;
                transform: scale(1.05);
            }
        }

        .question-text {
            font-weight: 500;
            margin-top: 1.5rem;
            color: #424242;
        }

        :host ::ng-deep .idle-warning-dialog {
            width: 500px;
            max-width: 90vw;
        }

        :host ::ng-deep .idle-warning-dialog .p-dialog-header {
            background-color: #c00a0a;
            border-bottom: 2px solid #ffc107;
            font-size: 1.15rem;
            font-weight: 600;
            padding: 1.25rem;
        }

        :host ::ng-deep .idle-warning-dialog .p-dialog-content {
            padding: 2rem;
            background-color: #ffffff;
        }

        :host ::ng-deep .idle-warning-dialog .p-dialog-footer {
            padding: 1rem 2rem;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            border-top: 1px solid #e0e0e0;
            background-color: #f5f5f5;
        }

        :host ::ng-deep .idle-warning-dialog .p-dialog-mask {
            backdrop-filter: blur(2px);
        }

        /* Style pour les petits écrans */
        @media (max-width: 600px) {
            :host ::ng-deep .idle-warning-dialog {
                width: 95vw;
            }

            .warning-content {
                padding: 1rem 0;
            }

            .warning-message,
            .question-text {
                font-size: 0.95rem;
            }

            :host ::ng-deep .idle-warning-dialog .p-dialog-content {
                padding: 1.5rem;
            }

            :host ::ng-deep .idle-warning-dialog .p-dialog-footer {
                flex-direction: column;
                gap: 0.5rem;
            }

            :host ::ng-deep .idle-warning-dialog .p-dialog-footer p-button {
                width: 100%;
            }
        }
    `]
})
export class IdleWarningModalComponent implements OnInit, OnDestroy {
    displayWarning = false;
    countdown = 60; // 60 secondes avant expiration
    
    private warningSubscription?: Subscription;
    private countdownInterval?: any;

    constructor(
        private idleTimeoutService: IdleTimeoutService,
        private loginService: LoginService
    ) {}

    ngOnInit(): void {
        console.log('🎬 Initialisation du composant d\'avertissement d\'inactivité');
        
        // Écouter les avertissements d'inactivité
        this.warningSubscription = this.idleTimeoutService.onWarning$.subscribe(
            (isWarning: boolean) => {
                console.log('📢 État de l\'avertissement:', isWarning);
                if (isWarning) {
                    this.showWarning();
                } else {
                    this.hideWarning();
                }
            }
        );
    }

    ngOnDestroy(): void {
        console.log('🛑 Destruction du composant d\'avertissement d\'inactivité');
        
        if (this.warningSubscription) {
            this.warningSubscription.unsubscribe();
        }
        this.clearCountdown();
    }

    private showWarning(): void {
        console.log('⚠️ Affichage du modal d\'avertissement');
        this.displayWarning = true;
        this.countdown = 60;
        this.startCountdown();
    }

    private hideWarning(): void {
        console.log('✅ Fermeture du modal d\'avertissement');
        this.displayWarning = false;
        this.clearCountdown();
    }

    private startCountdown(): void {
        this.clearCountdown();
        
        console.log('⏱️ Démarrage du compte à rebours (60 secondes)');
        
        this.countdownInterval = setInterval(() => {
            this.countdown--;
            
            // Logs tous les 10 secondes
            if (this.countdown % 10 === 0) {
                console.log(`⏱️ ${this.countdown} secondes restantes`);
            }
            
            if (this.countdown <= 0) {
                console.log('⏰ Temps écoulé - Fermeture du modal');
                this.clearCountdown();
                this.hideWarning();
                this.loginService.logout(false);
            }
        }, 1000);
    }

    private clearCountdown(): void {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = undefined;
        }
    }

    stayActive(): void {
        console.log('✅ Utilisateur a choisi de rester actif');
        this.idleTimeoutService.keepAlive();
        this.hideWarning();
    }

    logout(): void {
        console.log('🚪 Utilisateur a choisi de se déconnecter manuellement');
        this.hideWarning();
        
        // Déconnecter via le service de login
        this.loginService.logout(false);
    }
}