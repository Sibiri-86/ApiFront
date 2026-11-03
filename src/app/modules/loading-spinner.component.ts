// loading-spinner.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../service-util/interceptor/loading.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimisation: détection de changement OnPush
  animations: [
    trigger('fadeAnimation', [           // Name must match @fadeAnimation in template
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="loading-overlay" *ngIf="loadingService.loading$ | async" @fadeAnimation>
      <div class="loading-container">
        <p-progressSpinner 
          styleClass="custom-spinner"
          strokeWidth="4"
          fill="transparent"
          animationDuration="1s">
        </p-progressSpinner>
        <div class="loading-text">
          <p class="loading-title">Chargement en cours...</p>
          <p class="loading-subtitle">Veuillez patienter</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 50px;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      min-width: 250px;
      animation: scaleIn 0.3s ease-out;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .loading-text {
      margin-top: 24px;
      text-align: center;
    }

    .loading-title {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .loading-subtitle {
      margin: 0;
      color: #666;
      font-size: 14px;
      font-weight: 400;
    }

    /* Optimisation du spinner PrimeNG */
    ::ng-deep .custom-spinner {
      width: 80px !important;
      height: 80px !important;
    }

    ::ng-deep .custom-spinner .p-progress-spinner-circle {
      stroke: #377b53 !important;
      stroke-width: 4 !important;
      animation: spinner-dash 1.5s ease-in-out infinite !important;
    }

    ::ng-deep .custom-spinner svg {
      animation: spinner-rotate 2s linear infinite !important;
    }

    /* Animations optimisées */
    @keyframes spinner-rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes spinner-dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 100, 200;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 100, 200;
        stroke-dashoffset: -125;
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .loading-container {
        padding: 30px 40px;
        min-width: 200px;
      }

      ::ng-deep .custom-spinner {
        width: 60px !important;
        height: 60px !important;
      }

      .loading-title {
        font-size: 16px;
      }

      .loading-subtitle {
        font-size: 13px;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}