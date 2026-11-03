import { CommonModule } from '@angular/common';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable } from 'rxjs';
import { MenuActionService } from 'src/app/demo/service/menu-action.service';
import { MenuAction } from 'src/app/store/menu/model';

@Component({
  selector: 'app-menu-action',
  standalone: true,
  imports: [CommonModule,
      TableModule,
      FileUploadModule,
      FormsModule,
      ButtonModule,
      RippleModule,
      ToastModule,
      ToolbarModule,
      RatingModule,
      InputTextModule,
      InputTextareaModule,
      DropdownModule,
      RadioButtonModule,
      InputNumberModule,
      DialogModule,
      MultiSelectModule],
  templateUrl: './menu-action.component.html',
  styleUrl: './menu-action.component.scss'
})
export class MenuActionComponent {
  public menuActionDialog: boolean = false;
  public deleteMenuActionDialog: boolean = false;
  public deleteMenuActionsDialog: boolean = false;
  public menuActions: MenuAction[] = [];
  public menuAction: MenuAction = {
      deleted: false,
      id: 0,
      code: "",
      libelle: "",
      moduleParamId: 0,
      moduleParamLibelle: ""
  };
  public selectedMenuActions: MenuAction[] = [];
  public selectedMulti: any;
  public submitted: boolean = false;
  public isSaving: boolean = false;
  public cols: any[] = [
    { field: 'libelle', header: 'Libellé' },
    { field: 'code', header: 'Code' }
  ];
  public rowsPerPageOptions = [5, 10, 20];
    creeMenu: boolean = false;
    loading: any;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private menuActionService: MenuActionService
  ) { }

  ngOnInit() {
    this.loadMenuActions();
  }

  loadMenuActions() {
    this.menuActionService.query().subscribe((rest) => {
      if (rest.body) {
        this.menuActions = rest.body;
      }
    });
  }

  openNew() {
    this.menuAction = {moduleParamId: 0, moduleParamLibelle: ""};
    this.submitted = false;
    this.menuActionDialog = true;
  }

  deleteSelectedMenuActions() {
    this.deleteMenuActionsDialog = true;
  }

  editMenuAction(menuAction: MenuAction) {
    this.menuAction = { ...menuAction };
    this.selectedMulti = { libelle: menuAction.libelle, code: menuAction.code };
    this.creeMenu = true;
  }

  deleteMenuAction(menuAction: MenuAction) {
    this.deleteMenuActionDialog = true;
    this.menuAction = { ...menuAction };
  }

  hideDialog() {
    this.menuActionDialog = false;
    this.submitted = false;
  }

  saveMenuAction() {
    this.submitted = true;
    if (this.menuAction.id) {
      this.subscribeToSaveResponse(this.menuActionService.update(this.menuAction));
    } else {
      this.subscribeToSaveResponse(this.menuActionService.create(this.menuAction));
    }
  }

  confirmDelete() {
    this.menuActionService.delete(this.menuAction.id!).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'The menu action is deleted', life: 3000 });
      this.deleteMenuActionDialog = false;
      this.loadMenuActions();

    });
  }

  confirmDeleteSelected() {
    this.menuActionService.deleteAll(this.selectedMenuActions).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'The selected menu actions are deleted', life: 3000 });
      this.deleteMenuActionsDialog = false;
      this.loadMenuActions();
    });
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<MenuAction>>) {
    result.subscribe(
      () => this.onSaveSuccess(),
      (error: HttpErrorResponse) => this.onSaveError()
    );
  }

  private onSaveSuccess() {
    this.isSaving = false;
    this.loadMenuActions();
    this.menuActionDialog = false;
    this.menuAction = {moduleParamId: 0, moduleParamLibelle: ""};
  }

  protected onSaveError() {
    const errorMessage = 'Le code du menu existe déjà!'
    this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage + '!',
        life: 3000
    });
}

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

    creerMenu() {
      this.menuAction = {deleted: false,
          id: 0,
          code: "",
          libelle: "",
          moduleParamId: 0,
          moduleParamLibelle: ""};
        this.creeMenu = true;
    }

}
