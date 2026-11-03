import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { SplitButtonModule } from 'primeng/splitbutton';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { Profil } from 'src/app/store/profil/model';
import { ProfilService } from 'src/app/store/profil/service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { provideStore, select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import * as profilAction from '../../store/profil/action';
import * as profilSelector from '../../store/profil/selector';
import { FormsValidationComponent } from '../forms-validation/forms-validation.component';
import { StatusEnum } from 'src/app/store/global-config/model';
import * as globalSelector from '../../store/global-config/selector';
import { LoadingSpinnerComponent } from '../loading-spinner.component';


@Component({
    selector: 'app-profils',
    standalone: true,
    imports: [CommonModule,
        TableModule,LoadingSpinnerComponent,
        ButtonModule, RippleModule, TooltipModule, ToolbarModule, ToastModule, InputTextModule, FormsValidationComponent,
        ReactiveFormsModule, SplitButtonModule, PaginatorModule, DialogModule, ConfirmDialogModule,],
    providers: [MessageService, ConfirmationService],
    templateUrl: './profils.component.html',
    styleUrl: './profils.component.scss'
})
export class ProfilComponent implements OnInit, OnDestroy {
    destroy$ = new Subject<boolean>();
    profilList$!: Observable<Array<Profil>>;
    profilList!: Array<Profil>;
    profils: Profil[] = []
    cols: any[] = [];
    selectedProfil: Profil = {}
    keyword = '';
    clientCriteria!: Profil;
    enableFilter = false;
    formSearch!: FormGroup;
    totalItems = 0;
    itemsPerPage = 10;
    page = 0;
    first: number = 0;
    rows: number = 5;
    profilDialog: boolean = false;
    loading: boolean = true;
    isUpdate = false;
    items: MenuItem[] = [];
    profilFormGroup!: FormGroup;
    popupHeader = 'Enregistrer un profil';


    constructor(private fb: FormBuilder,
        private store: Store<AppState>, private messageService: MessageService,
        private confirmationService: ConfirmationService) {

    }



    ngOnInit(): void {
        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'libelle', header: 'Libellé' },
        ]
        this.createFormSearch();
        this.createFormProfil();
        this.profilList$ = this.store.pipe(select(profilSelector.profilList));
        this.store.dispatch(profilAction.loadProfil());
        this.profilList$.pipe(takeUntil(this.destroy$))
            .subscribe(value => {

                if (value) {
                    this.loading = false;
                    this.profilList = value;
                }
            });


        this.store.pipe(
            select(globalSelector.status),
            takeUntil(this.destroy$)
        ).subscribe(status => {
            if (status && status.message) {
                this.showToast(status.status, status.message);
            }
        });
    }


    private showToast(status: StatusEnum, message: string): void {
        this.messageService.clear();

        switch (status) {
            case StatusEnum.success:
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: message,
                    life: 3000
                });
                break;

            case StatusEnum.error:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: message,
                    life: 5000
                });
                break;

            case StatusEnum.warning:
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Attention',
                    detail: message,
                    life: 4000
                });
                break;
        }
    }

    onEnableFilter() {
        this.enableFilter = !this.enableFilter;
    }

    onRowSelect($event: any) {
        console.log($event.data);
    }


    createFormSearch(): void {
        this.formSearch = this.fb.group({
            keyword: [null],
        });
    }

    createFormProfil() {
        this.profilFormGroup = this.fb.group({
            id: this.fb.control('', []),
            code: this.fb.control('', [Validators.required,]),
            libelle: this.fb.control('', [Validators.required, Validators.minLength(2)]),
        })
    }


    handleActionsClick(profil: Profil): void {
        this.selectedProfil = profil;
    }


    onPageChange(event: any) {
        this.first = event.first;
        this.page = event.page;
        this.itemsPerPage = event.rows;
        this.rows = event.rows;
        // this.getProfil();
    }



    onResetForm() {
        this.formSearch.reset();
        // this.getProfil();
    }

    openNew() {
        this.profilDialog = true;

    }



    update(form: Profil) {
        this.popupHeader = 'Modifier un profil';
        this.profilFormGroup.patchValue({
            id: form.id,
            code: form.code,
            libelle: form.libelle,
        });
        this.profilDialog = true;
        this.isUpdate = true;
    }

    onSave() {
        const toSave: Profil = this.profilFormGroup.value;
        console.log("===============profilFormGroup=====================", this.profilFormGroup.value)

        this.confirmationService.confirm({
            message: 'Etes vous sur de vouloir ajouter ce profil?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',  // Bouton "Yes" en rouge
            rejectButtonStyleClass: 'p-button-secondary', // Bouton "No" en gris
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                if (toSave.id) {
                    this.store.dispatch(profilAction.updateProfil(toSave));

                } else {
                    this.store.dispatch(profilAction.createProfil(toSave));

                }
                this.profilFormGroup.reset();
            }
        });
        this.profilDialog = false;
    }

    deleteProfil(profil: Profil) {
        this.store.dispatch(profilAction.deleteProfil(profil));
    }

    cancel() {
        this.profilFormGroup.reset();
        this.profilDialog = false;
        this.isUpdate = false;
    }
    ngOnDestroy() {
        this.destroy$.next(true);
        // Now let's also unsubscribe from the subject itself:
        this.destroy$.unsubscribe();
    }
}
