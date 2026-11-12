import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import * as operateurAction from 'src/app/store/operateur/action';
import * as operateurSelector from 'src/app/store/operateur/selector';
import { Operateur } from 'src/app/store/operateur/model';
import { AuthServerProvider } from 'src/app/service-util/auth/auth-jwt.service';

type ApiKey = 'apiTr' | 'apiTvm' | 'apiImpot' | 'apiOds' | 'apiIfu';
type SecretKey = 'secretTr' | 'secretTvm' | 'secretImpot' | 'secretOds' | 'secretIfu';

interface ApiOption {
  key: ApiKey;
  secretKey: SecretKey;
  label: string;
  description: string;
}

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, PasswordModule, ToastModule],
  providers: [MessageService],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit, OnDestroy {
  operateur: Operateur | null = null;

  /** Copie locale des secrets en cours d'édition */
  secrets: Partial<Record<SecretKey, string>> = {};
  /** Secrets dont l'édition est ouverte */
  editing: Partial<Record<SecretKey, boolean>> = {};

  private sub?: Subscription;

  readonly apiOptions: ApiOption[] = [
    { key: 'apiTvm', secretKey: 'secretTvm', label: 'TVM', description: 'Taxe sur la valeur marchande' },
    { key: 'apiTr', secretKey: 'secretTr', label: 'TR', description: 'API TR' },
    { key: 'apiImpot', secretKey: 'secretImpot', label: 'Impôt', description: 'API Impôt' },
    { key: 'apiIfu', secretKey: 'secretIfu', label: 'IFU', description: 'Identifiant financier unique' },
    { key: 'apiOds', secretKey: 'secretOds', label: 'ODS', description: 'API ODS' }
  ];


  constructor(
    private store: Store<AppState>,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(operateurAction.loadOperateurConnecte());

    // Le backend ne renvoie que l'opérateur connecté : on prend le premier élément.
    // Si vous avez un sélecteur dédié (ex. currentOperateur), remplacez-le ici.
    this.sub = this.store.select(operateurSelector.operateurConnecte).subscribe((operateur) => {
      if (operateur) {
        this.operateur = operateur;
        this.resetSecrets();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** APIs auxquelles l'opérateur a accès */
  get activeApis(): ApiOption[] {
    return this.operateur ? this.apiOptions.filter((o) => !!this.operateur![o.key]) : [];
  }

  get hasChanges(): boolean {
    return this.activeApis.some(
      (o) => this.editing[o.secretKey] && (this.secrets[o.secretKey] ?? '') !== (this.operateur?.[o.secretKey] ?? '')
    );
  }

  startEdit(api: ApiOption): void {
    this.secrets[api.secretKey] = '';
    this.editing[api.secretKey] = true;
  }

  cancelEdit(api: ApiOption): void {
    this.secrets[api.secretKey] = this.operateur?.[api.secretKey] ?? '';
    this.editing[api.secretKey] = false;
  }

  saveSecrets(): void {
    if (!this.operateur) return;

    const payload: Operateur = { ...this.operateur };
    for (const api of this.activeApis) {
      if (this.editing[api.secretKey]) {
        const value = (this.secrets[api.secretKey] ?? '').trim();
        if (!value) {
          this.messageService.add({
            severity: 'error',
            summary: 'Validation',
            detail: `Le secret ${api.label} ne peut pas être vide.`
          });
          return;
        }
        payload[api.secretKey] = value;
      }
    }

    console.log('Dispatching updateOperateur with payload:==============', payload);

    this.store.dispatch(operateurAction.updateOperateur(payload));
    this.editing = {};
    this.messageService.add({
      severity: 'success',
      summary: 'Enregistré',
      detail: 'Les clés secrètes ont été mises à jour.'
    });
  }

  private resetSecrets(): void {
    this.editing = {};
    this.secrets = {};
    if (!this.operateur) return;
    for (const api of this.apiOptions) {
      this.secrets[api.secretKey] = this.operateur[api.secretKey] ?? '';
    }
  }
}
