import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import * as operateurAction from 'src/app/store/operateur/action';
import * as operateurSelector from 'src/app/store/operateur/selector';
import { Operateur } from 'src/app/store/operateur/model';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PasswordModule } from 'primeng/password';

type ApiKey = 'apiTr' | 'apiTvm' | 'apiImpot' | 'apiOds' | 'apiIfu';

@Component({
  selector: 'app-operateur',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    CheckboxModule,
    ToolbarModule,
    InputSwitchModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './operateur.component.html',
  styleUrl: './operateur.component.scss'
})
export class OperateurComponent implements OnInit {
  operateurs: Operateur[] = [];
  operateurList$!: Observable<Operateur[]>;
  operateurDialog = false;
  submitted = false;
  operateur: Operateur = this.createEmptyOperateur();

  apiOptions: Array<{ key: ApiKey; label: string }> = [
    { key: 'apiTvm', label: 'TVM' },
    { key: 'apiTr', label: 'TR' },
    { key: 'apiImpot', label: 'Impôt' },
    { key: 'apiIfu', label: 'IFU' },
    { key: 'apiOds', label: 'ODS' }
  ];

  constructor(
    private store: Store<AppState>,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.operateurList$ = this.store.select(operateurSelector.operateurList);
    this.store.dispatch(operateurAction.loadOperateur());

    this.operateurList$.subscribe((value) => {
      if (value) {
        this.operateurs = value;
      }
    });
  }

  createEmptyOperateur(): Operateur {
    return {
      deleted: false,
      apiTr: false,
      apiTvm: false,
      apiImpot: false,
      apiOds: false,
      apiIfu: false,
      secretTr: '',
      secretTvm: '',
      secretImpot: '',
      secretOds: '',
      secretIfu: ''
    };
  }

  addMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  openNew(): void {
    this.operateur = this.createEmptyOperateur();
    this.submitted = false;
    this.operateurDialog = true;
  }

  editOperateur(operateur: Operateur): void {
    this.operateur = { ...operateur };
    this.submitted = false;
    this.operateurDialog = true;
  }

  deleteOperateur(operateur: Operateur): void {
    if (operateur.id) {
      this.store.dispatch(operateurAction.deleteOperateur({ id: operateur.id }));
    }
  }

  saveOperateur(): void {
    this.submitted = true;

    if (!this.operateur.codeOperateur || !this.operateur.libelleOperateur) {
      this.addMessage('error', 'Validation', 'Le code et le libellé sont obligatoires.');
      return;
    }

    const payload: Operateur = {
      ...this.operateur,
      deleted: false,
      apiTr: !!this.operateur.apiTr,
      apiTvm: !!this.operateur.apiTvm,
      apiImpot: !!this.operateur.apiImpot,
      apiOds: !!this.operateur.apiOds,
      apiIfu: !!this.operateur.apiIfu,
      secretTr: this.operateur.apiTr ? this.operateur.secretTr ?? '' : '',
      secretTvm: this.operateur.apiTvm ? this.operateur.secretTvm ?? '' : '',
      secretImpot: this.operateur.apiImpot ? this.operateur.secretImpot ?? '' : '',
      secretOds: this.operateur.apiOds ? this.operateur.secretOds ?? '' : '',
      secretIfu: this.operateur.apiIfu ? this.operateur.secretIfu ?? '' : ''
    };

    if (payload.id) {
      this.store.dispatch(operateurAction.updateOperateur(payload));
    } else {
      this.store.dispatch(operateurAction.createOperateur(payload));
    }

    this.operateurDialog = false;
    this.operateur = this.createEmptyOperateur();
  }

  hideDialog(): void {
    this.operateurDialog = false;
    this.submitted = false;
    this.operateur = this.createEmptyOperateur();
  }

  getApiValue(key: ApiKey): boolean {
    return Boolean(this.operateur[key]);
  }

  setApiValue(key: ApiKey, value: boolean): void {
    this.operateur[key] = value;
  }

  getSelectedApiList(operateur: Operateur): string {
    const selected = this.apiOptions.filter((option) => Boolean(operateur[option.key]));
    return selected.length ? selected.map((option) => option.label).join(', ') : 'Aucune API';
  }
}
