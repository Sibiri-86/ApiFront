import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/service-util/auth/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    FormsModule,
    RippleModule,
    ReactiveFormsModule,
    RouterModule,
    DialogModule,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly DASHBOARD_URL = '/admin/dashboard';

  // Signaux
  authenticationError = signal(false);
  errorMessage = signal("Nom d'utilisateur ou mot de passe incorrect");
  isLoading = signal(false);
  rememberMe = signal(true);
  modalMotDePasseOublieOuvert = signal(false);

  // Réinitialisation du mot de passe
  resetPasswordSuccess = signal(false);
  resetPasswordError = signal('');
  isLoadingReset = signal(false);

  public form: FormGroup;
  public resetPasswordForm: FormGroup;
  private destroy$ = new Subject<void>();
  private resetTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.resetPasswordForm = fb.group({
      matricule: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    // Déjà connecté : pas besoin de repasser par le login
    if (this.loginService.isAuthenticated()) {
      this.goToDashboard();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.resetTimeout);
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================================
  // Connexion
  // ============================================================================

  login(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isLoading.set(true);
    this.authenticationError.set(false);

    const credentials = {
      login: this.form.value.username,
      password: this.form.value.password,
      rememberMe: this.rememberMe(),
    };

    this.loginService
      .login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        // Le jeton est déjà stocké quand on arrive ici : pas besoin de setTimeout
        next: () => this.handleSuccessfulLogin(),
        error: (error) => {
          console.error('Échec de la connexion:', error);
          this.authenticationError.set(true);
          this.handleLoginError(error);
          this.isLoading.set(false);
        },
      });
  }

  private handleSuccessfulLogin(): void {
    if (!this.loginService.isAuthenticated()) {
      this.authenticationError.set(true);
      this.errorMessage.set("Erreur d'authentification. Veuillez réessayer.");
      this.isLoading.set(false);
      return;
    }
    this.goToDashboard();
  }

  /** Point unique de navigation vers le dashboard (avec fallback) */
  private goToDashboard(): void {
    this.router.navigateByUrl(this.DASHBOARD_URL).then(
      (success) => {
        this.isLoading.set(false);
        if (!success) {
          console.error('Navigation refusée (guard ?), fallback');
          window.location.href = this.DASHBOARD_URL;
        }
      },
      (error) => {
        console.error('Erreur de navigation:', error);
        this.isLoading.set(false);
        window.location.href = this.DASHBOARD_URL;
      }
    );
  }

  private handleLoginError(error: any): void {
    if (error?.status === 401) {
      this.errorMessage.set("Nom d'utilisateur ou mot de passe incorrect");
    } else if (error?.status === 0) {
      this.errorMessage.set('Impossible de joindre le serveur');
    } else if (error instanceof Error && error.message) {
      // Erreur métier renvoyée par le backend (ENTETE.MESSAGE) avec un HTTP 200
      this.errorMessage.set(error.message);
    } else {
      this.errorMessage.set('Erreur de connexion. Veuillez réessayer.');
    }

    setTimeout(() => document.getElementById('username')?.focus(), 100);
  }

  toggleRememberMe(): void {
    this.rememberMe.update((value) => !value);
  }

  // ============================================================================
  // Mot de passe oublié
  // ============================================================================

  ouvrirModal(): void {
    this.modalMotDePasseOublieOuvert.set(true);
    this.resetState();
  }

  fermerModal(): void {
    clearTimeout(this.resetTimeout);
    this.modalMotDePasseOublieOuvert.set(false);
    this.resetState();
  }

  private resetState(): void {
    this.resetPasswordSuccess.set(false);
    this.resetPasswordError.set('');
    this.resetPasswordForm.reset();
  }

  envoyerLienReinitialisation(): void {
    if (this.resetPasswordForm.invalid) {
      this.markFormGroupTouched(this.resetPasswordForm);
      return;
    }

    this.isLoadingReset.set(true);
    this.resetPasswordError.set('');
    this.resetPasswordSuccess.set(false);

    const matricule = this.resetPasswordForm.get('matricule')?.value;

    this.loginService
      .resetPassword(matricule)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoadingReset.set(false);
          this.resetPasswordSuccess.set(true);
          // Fermeture automatique après 3 secondes
          this.resetTimeout = setTimeout(() => {
            if (this.resetPasswordSuccess()) {
              this.fermerModal();
            }
          }, 3000);
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi du lien:", error);
          this.isLoadingReset.set(false);

          if (error?.status === 404) {
            this.resetPasswordError.set("Ce matricule n'existe pas dans notre système.");
          } else if (error?.status === 0) {
            this.resetPasswordError.set('Erreur de connexion au serveur.');
          } else {
            this.resetPasswordError.set(
              error?.error?.message || error?.message || 'Une erreur est survenue. Veuillez réessayer.'
            );
          }
        },
      });
  }

  /** Conservé pour le template : ouvre la modale au lieu de naviguer vers une route inexistante */
  requestResetPassword(): void {
    this.ouvrirModal();
  }

  /** Attention : la route '/inscription' n'existe pas dans app.routes.ts */
  register(): void {
    this.router.navigate(['/inscription']);
  }

  // ============================================================================
  // Validation des formulaires
  // ============================================================================

  hasFieldError(fieldName: string, formGroup: FormGroup = this.form): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string, formGroup: FormGroup = this.form): string {
    const field = formGroup.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'Ce champ est requis';
    }
    if (field.errors['minlength']) {
      return `Minimum ${field.errors['minlength'].requiredLength} caractères requis`;
    }
    if (field.errors['email']) {
      return 'Veuillez entrer une adresse e-mail valide';
    }
    return 'Champ invalide';
  }

  private markFormGroupTouched(formGroup: FormGroup = this.form): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      control?.markAsDirty();
    });
  }
}