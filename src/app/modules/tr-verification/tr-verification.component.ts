import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { TrActions } from '../../store/tr-verification/action';
//import * as TrActions from '../../store/tr/action';
import { selectErreur, selectLoading, selectMessage, selectResultat } from '../../store/tr-verification/reducer';
import { AuthServerProvider } from 'src/app/service-util/auth/auth-jwt.service';
import { ReponseVerification, ResultatVerification } from 'src/app/store/tr-verification/model';

@Component({
  selector: 'app-tr-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    TagModule,
  ],
  template: `
    <div class="grid">
      <div class="col-12 lg:col-5">
        <p-card header="Vérifier une transaction TR">
          <form [formGroup]="form" (ngSubmit)="verifier()" class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
              <label for="idTransaction" class="font-medium">Identifiant de transaction</label>
              <input
                id="idTransaction"
                pInputText
                formControlName="idTransaction"
                autocomplete="off"
                placeholder="Ex. TR-2026-000123"
              />
              <small class="p-error" *ngIf="invalide('idTransaction')">
                L'identifiant de transaction est obligatoire.
              </small>
            </div>
 
            <div class="flex gap-2">
              <p-button
                type="submit"
                label="Vérifier"
                icon="pi pi-search"
                [loading]="loading()"
                [disabled]="form.invalid"
              ></p-button>
              <p-button
                type="button"
                label="Effacer"
                severity="secondary"
                [outlined]="true"
                (onClick)="effacer()"
              ></p-button>
            </div>
          </form>
        </p-card>
      </div>
 
      <div class="col-12 lg:col-7">
        <p-card header="Résultat">
        
          <p-message
            *ngIf="erreur() as e"
            severity="error"
            styleClass="w-full justify-content-start"
            [text]="e.message + ' (code ' + e.code + ')'"
          ></p-message>
 
          <ng-container *ngIf="resultat() as r">
            <div class="flex align-items-center gap-2 mb-4">
              <p-tag severity="success" value="Transaction trouvée"></p-tag>
              <span class="text-color-secondary">{{ message() }}</span>
            </div>
 
            <div class="grid">
              <div class="col-12 md:col-6" *ngFor="let l of lignes(r)">
                <div class="text-color-secondary text-sm mb-1">{{ l.label }}</div>
                <div class="font-medium">{{ l.value ?? '—' }}</div>
              </div>
            </div>
          </ng-container>
 
          <p *ngIf="!resultat() && !erreur() && !loading()" class="text-color-secondary m-0">
            Saisissez un identifiant de transaction pour consulter les données enregistrées par la DGI.
          </p>
        </p-card>
      </div>
    </div>
  `,
})
export class TrVerificationComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private auth = inject(AuthServerProvider);

  form = this.fb.nonNullable.group({
    idTransaction: ['', [Validators.required, Validators.pattern(/\S+/)]],
    jeton: [this.auth.getAccessToken() ?? ''],
  });

  loading = this.store.selectSignal(selectLoading);
  resultat = this.store.selectSignal(selectResultat);
  erreur = this.store.selectSignal(selectErreur);
  message = this.store.selectSignal(selectMessage);

  invalide(champ: 'idTransaction' | 'jeton'): boolean {
    const c = this.form.controls[champ];
    return c.invalid && (c.dirty || c.touched);
  }

  verifier(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { idTransaction, jeton } = this.form.getRawValue();
    this.store.dispatch(
      TrActions.verifier({
        demande: { VIDTRANSACTION: idTransaction.trim(), JETON: jeton },
      })
    );
  }

  effacer(): void {
    this.form.reset({
      idTransaction: '',
      jeton: this.auth.getAccessToken() ?? '',
    });
    this.store.dispatch(TrActions.reinitialiser());
  }

  lignes(r: ResultatVerification): { label: string; value: string | null | undefined }[] {
    return [
      { label: 'Transaction', value: r.IDTRANSACTION },
      { label: 'Quittance', value: r.QUITTANCE },
      { label: 'Opérateur', value: r.OPERATEUR },
      { label: 'Code contribuable', value: r.CODECONTRIBUABLE },
      { label: 'Nom', value: r.NOM },
      { label: 'Prénom', value: r.PRENOM },
      { label: 'Téléphone', value: r.NUMERO_CONTRIBUABLE },
      {
        label: 'Montant payé',
        value: r.MONT_PRELEVE !== undefined ? this.formaterMontant(r.MONT_PRELEVE) : undefined,
      },
      { label: 'Date de paiement', value: this.formaterDate(r.DATEPAYEMENT) },
    ];
  }

  private formaterMontant(montant: number): string {
    return `${new Intl.NumberFormat('fr-FR').format(montant)} FCFA`;
  }

  /** "23/10/2026 00:00:00" -> "23/10/2026" quand l'heure est minuit */
  private formaterDate(date?: string): string | undefined {
    return date?.replace(/ 00:00:00$/, '');
  }

  ngOnDestroy(): void {
    this.store.dispatch(TrActions.reinitialiser());
  }
}