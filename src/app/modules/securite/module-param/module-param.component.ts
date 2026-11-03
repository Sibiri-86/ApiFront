import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CountryService } from 'src/app/demo/service/country.service';
import { MenuActionService } from 'src/app/demo/service/menu-action.service';
import { ModulePramDetailComponent } from './module-pram-detail/module-pram-detail.component';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModuleParamService } from 'src/app/demo/service/module-param.service';
import { MenuAction } from 'src/app/store/menu/model';
import { ModuleParam } from 'src/app/store/module-param/model';
import { AppState } from 'src/app/store/app.state';
import { select, Store } from '@ngrx/store';
import * as moduleAction from '../../../store/module-param/action';
import * as moduleSelector from '../../../store/module-param/selector';
import { LoadingSpinnerComponent } from '../../loading-spinner.component';



@Component({
  selector: 'app-module-param',
  standalone:true,
  providers: [MessageService, ConfirmationService],
  imports: [
        CommonModule,
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
        MultiSelectModule,
        LoadingSpinnerComponent,
    ],
  templateUrl: './module-param.component.html',
  styleUrl: './module-param.component.scss'
})
export class ModuleParamComponent {

public moduleParamDialog: boolean = false;

public deleteModuleParamDialog: boolean = false;

public deleteModuleParamsDialog: boolean = false;

public moduleParams: ModuleParam[] = [];

public moduleParam: ModuleParam = {};

public selectedModuleParams: ModuleParam[] = [];
moduleParamsList$!: Observable<Array<ModuleParam>>;
menuActionsList$!: Observable<Array<MenuAction>>;
public selectedMulti: any;
destroy$ = new Subject<boolean>();

public submitted: boolean = false;

public cols: any[] = [];
creeMenu: boolean = false;
i:number = -1;

public statuses: any[] = [];
public menuActions: MenuAction[] = [];
public menuActionsList: MenuAction[] = [];
    selectedMenus: MenuAction[] = [];
public menuAction: MenuAction = {
    deleted: false,
    //id: 0,
    code: "",
    libelle: "",
    // moduleParamId: 0,
};


public rowsPerPageOptions = [5, 10, 20];
    creeMod: boolean = false;
    loading: any;
    menuActionListe: MenuAction[] = [];


constructor(
    private messageService: MessageService,
    private moduleParamService: ModuleParamService,
    private countryService: CountryService,private store: Store<AppState>,
    private menuService: MenuActionService,
) { }

ngOnInit() {


    this.moduleParamsList$ = this.store.pipe(select(moduleSelector.moduleParamList));
           this.store.dispatch(moduleAction.loadModuleParam());
           this.moduleParamsList$.pipe(takeUntil(this.destroy$))
                     .subscribe(value => {
                       
                       if (value) {
                         this.loading = false;
                         this.moduleParams = value;
                         console.log("===========value==============",value);
                       }
           });
   
         
}


addMessage(severite: string, resume: string, detaile: string): void {
    this.messageService.add({severity: severite, summary: resume, detail: detaile});
  }

saveMenuAction() {
    this.submitted = true;
    if (this.menuAction.code && this.menuAction.libelle ) {
        if(this.i !=-1) {
            this.menuActions[this.i] = this.menuAction;
        } else {
            this.menuActions.push(this.menuAction);
        }
        this.i=-1;
        this.menuAction = {};
    } else {
        this.addMessage('error', 'Enregistrement non pris en compte',
        'Veuillez renseigner les champs obligatoire !!!');

    }

  }

  modifierMenu(menuAction: MenuAction, i: number) {
console.log("=============",i);
    this.i = i;
    this.menuAction = menuAction;

  }

  deleteMenu(menuAction: MenuAction, i: number) {

        if(!menuAction.id) {
            if(i>0) {
                for(let j= 0; j< i; j++) {
                this.menuActionsList.push(this.menuActions[j]);
                }
                for(let j= i+1; j< this.menuActions.length ; j++) {
                this.menuActionsList.push(this.menuActions[j]);
                }

            }else {
                for(let j= 1; j< this.menuActions.length; j++) {
                this.menuActionsList.push(this.menuActions[j]);
                }
            }

                this.menuActions = this.menuActionsList;

        } else {
            this.menuActions = this.menuActions.filter(menu=>menu.id === menuAction.id);
            this.menuService.delete(menuAction.id).subscribe((re)=>{

            })
    }



  }

  creerMenu() {
    this.menuAction = {deleted: false,
       // id: 0,
        code: "",
        libelle: "",
       // moduleParamId: 0,
        };
      this.creeMenu = true;
  }

load() {
    this.moduleParamService.query().subscribe((rest) => {
        if (rest.body) {
            this.moduleParams = rest.body;
        }
    });
}

openNew() {
   // this.moduleParam = {};
    this.submitted = false;
    this.creeMenu = true;
}

deleteSelectedModuleParams() {
    this.deleteModuleParamsDialog = true;
}

editModuleParam(moduleParam: ModuleParam) {
    this.moduleParam = { ...moduleParam };
    this.selectedMulti = { libelle: moduleParam.libelle, code: moduleParam.code };
    this.creeMod = true;
    if(moduleParam.menuActions) {
        this.selectedMenus = moduleParam.menuActions;
    }
    if(moduleParam.id) {
        this.moduleParamService.findMenuByModule(moduleParam.id).subscribe((res)=> {
            if(res.body) {
                this.menuActions = res.body;
                console.log("nnnnnnnn", this.menuActions);
            }
        });
    }
}

deleteModuleParam(moduleParam: ModuleParam) {
    this.deleteModuleParamDialog = true;
    this.moduleParam = { ...moduleParam };
}

confirmDeleteSelected() {
    this.deleteModuleParamsDialog = false;
    this.store.dispatch(moduleAction.deleteModuleParams({moduleParams: this.selectedModuleParams}));
    this.load();
    this.selectedModuleParams = [];
}

confirmDelete() {
    this.deleteModuleParamDialog = false;
    if (this.moduleParam.id) { // Adjust if your ModuleParam entity has a different ID field
        this.store.dispatch(moduleAction.deleteModuleParam(this.moduleParam));
    }
    this.moduleParam = {};
}

hideDialog() {
    this.moduleParamDialog = false;
    this.submitted = false;
}

saveModuleParam() {
    this.submitted = true;
    if (this.moduleParam.libelle && this.moduleParam.code &&  this.menuActions ) {
        this.moduleParam.menuActions =this.menuActions;
        if (this.moduleParam.id) {
            this.store.dispatch(moduleAction.updateModuleParam(this.moduleParam));
        } else {
            this.store.dispatch(moduleAction.createModuleParam(this.moduleParam));
        }
        this.moduleParamDialog = false;
        this.moduleParam = {};
        this.selectedMulti = {};
        this.menuActions = [];
    }
}

onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}


protected onSaveSuccess() {
    this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Opération réussie !',
        life: 3000
    });
    this.load();
}

protected onSaveError() {
    const errorMessage = 'Le code du module existe déjà!'
    this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage + '!',
        life: 3000
    });
}

    creerModuleA() {
    this.moduleParam = {};
        this.creeMod = true;
    }

    
    closeMenu() {
        this.creeMenu = false;
    }

    annulerMenu() {
        this.menuAction = {};
    }
}
