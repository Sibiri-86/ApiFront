import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';

// IMPORTEZ VOS SERVICES
import { LoginService } from 'src/app/service-util/auth/login.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  resetSuccess = false;
  resetError = '';
  isLoading = false;
  resetToken = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService  // ← Ajout du LoginService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(4)]],  // Min 4 comme dans le backend
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Récupérer le token depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      
      if (!this.resetToken) {
        this.resetError = 'Lien de réinitialisation invalide. Veuillez demander un nouveau lien.';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Validateur personnalisé pour vérifier que les mots de passe correspondent
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Vérifier si un champ a une erreur
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtenir le message d'erreur d'un champ
   */
  getFieldError(fieldName: string): string {
    const field = this.resetForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      return 'Ce champ est requis';
    }
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    return 'Champ invalide';
  }

  confirmerReinitialisation(): void {
    if (this.resetForm.invalid || !this.resetToken) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.resetError = '';
    this.resetSuccess = false;

    const newPassword = this.resetForm.get('newPassword')?.value;

    // Appel au service de réinitialisation
    this.loginService
      .confirmResetPassword(this.resetToken, newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Mot de passe réinitialisé avec succès:', response);
          this.isLoading = false;
          this.resetSuccess = true;
          
          // Redirection automatique après 3 secondes
          setTimeout(() => {
            this.router.navigate(['/admin/login']);
          }, 3000);
        },
        error: (error) => {
          console.error('Erreur lors de la réinitialisation:', error);
          this.isLoading = false;
          
          if (error.status === 400) {
            this.resetError = 'Le lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouveau lien.';
          } else if (error.status === 0) {
            this.resetError = 'Erreur de connexion au serveur.';
          } else {
            this.resetError = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
          }
        }
      });
  }
}