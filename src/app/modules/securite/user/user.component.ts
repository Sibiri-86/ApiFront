import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Observable, Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ProfilService } from 'src/app/demo/service/profil.service'
import { MenuActionService } from 'src/app/demo/service/menu-action.service';
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
import { SplitButtonModule } from 'primeng/splitbutton';
import { PasswordModule } from 'primeng/password';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Profil } from 'src/app/demo/components/model/profil';
import { UserService } from 'src/app/demo/service/user.service';
import { AccountService } from 'src/app/service-util/auth/account.service';
import { User } from 'src/app/store/user/model';
import { AppState } from 'src/app/store/app.state';
import { select, Store } from '@ngrx/store';
import * as userAction from '../../../store/user/action';
import * as userSelector from '../../../store/user/selector';
import * as profilAction from '../../../store/profil/action';
import * as profilSelector from '../../../store/profil/selector';
import { MenuAction } from 'src/app/store/menu/model';
import { StatusEnum } from 'src/app/store/global-config/model';
import * as globalSelector from '../../../store/global-config/selector';
import * as menuAction from '../../../store/menu/action';
import * as menuSelector from '../../../store/menu/selector';
import { LoadingSpinnerComponent } from '../../loading-spinner.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { em } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-user',
    standalone:true,
    imports: [
            CommonModule,LoadingSpinnerComponent,
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
            SplitButtonModule,
            PasswordModule,
            OverlayPanelModule,
            InputGroupModule,
            InputGroupAddonModule
        ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {

    countries: any[] = [];
    selectedItem: any = null;
    selectedProfilItem:  any = null;
    userDialog: boolean = false;
    destroy$ = new Subject<boolean>();

    deleteuserDialog: boolean = false;

    deleteusersDialog: boolean = false;

    users: User[] = [] ;
    userList$!: Observable<Array<User>>;
    profilList$!: Observable<Array<Profil>>;
    menuList$!: Observable<Array<MenuAction>>;

    user: User = {};
    detailUser: User = {};

    selectedusers: User[] = [];
    selectedMulti: any;

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    profils: Profil[] = [];
    ancien!: string;
    visible: boolean = false;
    newPassword!: string ;
    loading: any;
    items: any[] = [];
    profilItems : any[] = [];
    itemsNoActif: any[] = [];
    newS: boolean = false;
    selectedProfil: Profil | undefined;
    userD: boolean = false;
    userbyId: User = {};

    emails: string[] = [];
    display:boolean = false;
    displayMenu:boolean = false;
    menus: MenuAction[] = [];
    displayProfil:boolean = false;
    addNewProfil:boolean = false;
    profil: Profil = {};
    profilDialog: boolean = false;
    menuActions: MenuAction[]= [];
    creeMenu: boolean = false;
    isProfil: boolean = false;
    detailProfil: Profil = {};
    menuActionsDetail: MenuAction[]= [];
    emailUser: string = "";


    public menuAction: MenuAction = {
        deleted: false,
        id: 0,
        code: "",
        libelle: "",
        moduleParamId: 0,
        moduleParamLibelle: ""
    };

    deleteprofilDialog: boolean = false;

    deleteprofilsDialog: boolean = false;
    selectedProfils: Profil[] = [];
    selectedMenus: MenuAction[] = [];
    tes: boolean =true;
    op: boolean = false;
    op2: boolean = false;




    constructor(private messageService: MessageService, private confirmationService: ConfirmationService,private store: Store<AppState>,
         private userService: UserService,private accountService: AccountService,
          private profilService: ProfilService) { }

    ngOnInit() {
        this.loadItems();
        this.loadItemsProfil();

        this.cols = [
            { field: 'login', header: 'Login' },
            { field: 'email', header: 'Email' },
            { field: 'lastName', header: 'Nom' },
        ];


        this.menuList$ = this.store.pipe(select(menuSelector.menuActionList));
       this.store.dispatch(menuAction.loadMenuAction());
       this.menuList$.pipe(takeUntil(this.destroy$))
                 .subscribe(value => {

                   if (value) {
                     this.menuActions = value;
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
       this.profilList$ = this.store.pipe(select(profilSelector.profilList));
       this.store.dispatch(profilAction.loadProfil());
       this.profilList$.pipe(takeUntil(this.destroy$))
                 .subscribe(value => {

                   if (value) {
                     this.profils = value;
                   }
       });

      this.userList$ = this.store.pipe(select(userSelector.userList));
              this.store.dispatch(userAction.loadUser());
              this.userList$.pipe(takeUntil(this.destroy$))
                        .subscribe(value => {

                          if (value) {
                            this.loading = false;
                            this.users = value;
                          }
              });

    }

    

    findDroitMenu() {
        if(this.op2) {
            this.op2 = false;
        } else {
            this.op2 = true;
        }
    }

    findUserMenu() {

        if(this.op) {
            this.op = false;
        } else {
            this.op = true;
        }
    }

    openNewProfil() {

        this.creeMenu =true;
        this.profil = {};

    }
    addUser() {
        this.user = {};
        this.display = true;
    }

    annulerProfile() {
        this.profil = {};
        this.addNewProfil = false;
        this.selectedMenus = [];
    }
    newProfil() {
        this.profil = {};
        this.addNewProfil = true;
    }
    deleteSelectedProfils() {
        this.deleteprofilsDialog = true;
    }

    showDetailsDialog(profil: Profil) {
        this.detailProfil = { ...profil };
        console.log("================",profil);
        this.isProfil = true;
        if(profil.menus) {
            this.menuActionsDetail = profil.menus;
        }
    }
    fermerProfil() {
        this.isProfil = false;
        this.detailProfil = {};

    }
    editProfil(profil: Profil) {
        this.profil = { ...profil };
        this.addNewProfil = true;

        if(profil.menus) {
            this.selectedMenus = profil.menus;
        }

        this.profilDialog = true;
    }

    deleteProfil(profil: Profil) {
        this.deleteprofilDialog = true;
        this.profil = { ...profil };
    }

    confirmProfilDeleteSelected() {
        this.deleteprofilsDialog = false;
        this.store.dispatch(profilAction.deleteProfils({ProfilList:this.selectedProfils}));
         this.selectedProfils = [];
    }

    confirmProfilDelete() {
        this.deleteprofilDialog = false;
        if(this.profil.id) {
            this.store.dispatch(profilAction.deleteProfil(this.profil));
        }

        this.profil = {};
    }


    saveProfil() {

        if (this.profil.code && this.profil.libelle ) {
           this.profil.menus = this.selectedMenus;
           console.log("==================================", this.profil);
            if (this.profil.id) {
               this.store.dispatch(profilAction.updateProfil(this.profil));
            } else {
                this.store.dispatch(profilAction.createProfil(this.profil));

            }


            this.profilDialog = false;
            this.addNewProfil = false;
            this.profil = {};
            this.selectedMulti ={};
            this.selectedMenus = [];
        }
    }


    loadItemsProfil(){
        this.profilItems = [
            {
                label: 'Détails',
                icon: 'pi pi-eye',
                command: ($event: any) => {
                    this.showDetailsDialog(this.selectedProfilItem);
                }
            },
            {
                label: 'Modifier',
                icon: 'pi pi-pencil',
                command: ($event: any) => {
                    this.editProfil(this.selectedProfilItem);
                }
            },
           /* {
                label: 'Droit',
                icon: 'pi pi-pencil',
                command: ($event: any) => {
                    this.editProfil(this.selectedProfilItem);
                }
            },
            {
                label: 'retirer',
                icon: 'pi pi-pencil',
                command: ($event: any) => {
                    this.editProfil(this.selectedProfilItem);
                }
            },*/
            {
                label: 'Supprimer',
                icon: 'pi pi-times',
                command: ($event: any) => {
                    this.deleteProfil(this.selectedProfilItem);
                }
            },



        ]


    }
    loadItems(){
            this.items = [
                {
                    label: 'Détails',
                    icon: 'pi pi-eye',
                    command: ($event: any) => {
                        console.log('Current user:', this.selectedItem);
                        this.findUser();
                    }
                },

                {


                    label: 'Activer',
                    icon: 'pi pi-check',
                    command: ($event: any) => {

                        this.activeDesactiveUser(this.selectedItem);
                    }
                },
              /*  {
                    label: 'Réiniatiser Mot de passe',
                    icon: 'pi pi-lock',
                    command: ($event: any) => {
                        console.log('Current user:', this.selectedItem);
                        this.showDialog();
                    }
                },*/

            ]

            this.itemsNoActif = [
                {
                    label: 'Détails',
                    icon: 'pi pi-eye',
                    command: ($event: any) => {
                        console.log('Current user:', this.selectedItem);
                        this.findUser();
                    }
                },
                {
                    label: 'Modifier',
                    icon: 'pi pi-pencil',
                    command: ($event: any) => {
                        console.log('Current user:', this.selectedItem);
                        this.editUser(this.selectedItem);
                    }
                },
               /*  {
                    label: 'Supprimer',
                    icon: 'pi pi-times',
                    command: ($event: any) => {
                        console.log('Current user deleted:', this.selectedItem);
                        this.deleteUser(this.selectedItem);
                    }
                }, */
                {

                    label: 'Désactiver',
                    icon: 'pi pi-check',
                    command: ($event: any) => {
                       // console.log('Current user deleted:', this.selectedItem);
                        this.activeDesactiveUser(this.selectedItem);
                    }
                },
                {
                    label: 'Réinit. mot de passe',
                    icon: 'pi pi-lock',
                    command: ($event: any) => {
                        console.log('Current user:', this.selectedItem);
                        this.showDialog(this.selectedItem);
                    }
                },

            ]
        }

        findActionByProfil() {
            this.displayMenu = true;
           /*  if(this.displayMenu) {
                this.profilService.find(this.detailUser?.profil?.id).subscribe((res)=>{
                    if(res.body) {

                    }
                })
            } */
        }



    showDialog(user:User) {
        this.visible = true;
        if(user.emailAddress) {
            this.emailUser = user.emailAddress;
        }

    }


    renitialise() {

        this.store.dispatch(userAction.reunitialiser( { email: this.emailUser, newPassword: this.newPassword } ));
      /*  this.accountService.reunitialise(this.emailUser, this.newPassword).subscribe((res)=>{

       }); */

       this.emailUser = "";
       this.newPassword = "";
        this.visible = false;
    }


    fermer() {
        this.userD = false;
        this.detailUser ={};
    }

    addProfil() {
        this.displayProfil = true;
    }

    fermerGestionProfil() {
        this.displayProfil = false;
    }
    findUser() {
        this.detailUser = this.selectedItem;


       // console.log("======resbody==================", this.detailUser)

        if(this.detailUser.profil && this.detailUser.profil?.id) {
            this.profilService.find(this.detailUser.profil?.id).subscribe((res)=> {

                if(res.body) {
                 //   console.log("======resbody==================", res.body)
                    if(res.body.menus) {
                        this.menus = res.body.menus;
                    } else {
                        this.menus = [];
                    }

                } else {
                    this.menus = [];
                }
            });
           // this.menus = this.detailUser.profil?.menus;
        }

       /*  this.userService.find(this.selectedItem.id).subscribe((res)=>{
            if (res.body) {
                this.userbyId = res.body;

            }
        }); */
        this.userD = true;
    }





    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.deleteusersDialog = true;
    }

    editUser(user: User) {
        console.log("agenceeeeeeeeee",user)

        this.selectedProfil=this.profils.find(p => p.id === user.profil?.id );
       // console.log("agenceeeeeeeeee",this.selectedAgence);

        this.user = { ...user };
        console.log("agenceeeeeeeeee",this.user)


        if(user.profil) {
            this.user.profil = this.profils.find(fil=> fil.id === user.profil?.id);
        }
        this.display =true;

     //   console.log("====================user=========",this.user.filiale)
    }

    deleteUser(user: User) {
        this.deleteuserDialog = true;
        this.user = { ...user };
    }

    confirmDeleteSelected() {
        this.deleteusersDialog = false;
        this.store.dispatch(userAction.deleteAllUser({users: this.selectedusers}));
         this.selectedusers = [];
    }
    activeDesactiveUser(user:User) {

        console.log("user==================",user);
        this.store.dispatch(userAction.activerDesactiver( user));
    }

    confirmDelete() {
        this.deleteuserDialog = false;
        if(this.user.id) {
            this.store.dispatch(userAction.deleteUser(this.user.id));
        }

        this.user = {};
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    filter1(event: Event) {
        console.log("====================",event);
    }
    saveUser() {
        this.submitted = true;
        console.log("====================",this.user)
       // if (this.user.nom && this.user.code && this.user.codeBanque && this.user.pays) {
            if (this.user.id) {
                this.store.dispatch(userAction.updateUser(this.user));
            } else {
                this.store.dispatch(userAction.createUser(this.user));

            }


            this.userDialog = false;
            this.user = {};
            this.selectedMulti ={};
       // }
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }



    annuler() {
        this.user = {};
        this.display = false;
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        // Now let's also unsubscribe from the subject itself:
        this.destroy$.unsubscribe();
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
}
