import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppMenuitemComponent } from './app.menuitem.component';
import { AccountService } from '../service-util/auth/account.service';
import { ROLES } from '../service-util/auth/roles';

interface MenuItem {
    label?: string;
    icon?: string;
    routerLink?: string[];
    roles?: string[];
    items?: MenuItem[];
    separator?: boolean;
}

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [NgFor, NgIf, AppMenuitemComponent]
})
export class AppMenuComponent implements OnInit, OnDestroy {

    model: MenuItem[] = [];

    private authSubscription?: Subscription;

    constructor(private accountService: AccountService) {}

    ngOnInit(): void {
        // Reconstruire le menu à chaque changement d'authentification
        this.authSubscription = this.accountService
            .getAuthenticationState()
            .subscribe(() => this.buildMenu());

        // Construction initiale
        this.buildMenu();
    }

    ngOnDestroy(): void {
        this.authSubscription?.unsubscribe();
    }

    private buildMenu(): void {
        const fullMenu: MenuItem[] = [
            {
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/admin/dashboard']
                    }
                ]
            },

            {
                label: 'Administration',
                icon: 'pi pi-fw pi-shield',
                roles: [ROLES.GRP_ADMINISTRATION],
                items: [
                    {
                        label: 'Utilisateurs',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/admin/user'],
                        roles: [ROLES.UTILISATEUR],
                    },
                    {
                        label: 'Opérateurs',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/admin/operateurs'],
                        roles: [ROLES.OPERATEUR],
                    },
                    {
                        label: 'Applications',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/admin/applications'],
                        roles: [ROLES.APPLICATION],
                    },
                    {
                        label: 'Module',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/admin/module-param'],
                        roles: [ROLES.APPLICATION], // même rôle que dans les routes
                    },
                ]
            },

            {
                label: 'TVM',
                icon: 'pi pi-fw pi-car',

                items: [
                    {
                        label: 'Vérification',
                        icon: 'pi pi-fw pi-verified',
                        routerLink: ['/admin/tvm-verification'],
                        roles: [ROLES.VERIFICATION],
                    },
                    {
                        label: 'Consultation',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/admin/quittance-tvm'],
                        roles: [ROLES.CONSULTATION_TVM],
                    },
                ]
            },

            {
                label: 'Taxe de Résidence',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'Vérification',
                        icon: 'pi pi-fw pi-verified',
                        routerLink: ['/admin/tr-verification'],
                        roles: [ROLES.VERIFICATION_TR],
                    },
                    {
                        label: 'Consultation',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/admin/quittance-tr'],
                        roles: [ROLES.CONSULTATION_TR],
                    },
                ]
            },

            {
                label: 'Impôt',
                icon: 'pi pi-fw pi-wallet',
                items: [
                    {
                        label: 'Consultation',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/admin/quittance-impot'],
                        roles: [ROLES.CONSULTATION_IMPOT],
                    },
                ]
            },
        ];

        // Filtrer le menu selon les rôles de l'utilisateur
        this.model = this.filterMenuByRoles(fullMenu);
    }

    private filterMenuByRoles(menuItems: MenuItem[]): MenuItem[] {
        return menuItems
            .map(item => {
                const filteredItem: MenuItem = { ...item };

                // Filtrer les sous-items
                if (filteredItem.items && Array.isArray(filteredItem.items)) {
                    filteredItem.items = filteredItem.items.filter((subItem: MenuItem) => {
                        if (subItem.roles && Array.isArray(subItem.roles)) {
                            return this.accountService.hasAnyAuthority(subItem.roles);
                        }
                        return true;
                    });

                    // Aucun sous-item visible : on masque le groupe
                    if (filteredItem.items.length === 0) {
                        return null;
                    }
                }

                // Rôles du groupe parent
                if (filteredItem.roles && Array.isArray(filteredItem.roles)) {
                    if (!this.accountService.hasAnyAuthority(filteredItem.roles)) {
                        return null;
                    }
                }

                return filteredItem;
            })
            .filter((item): item is MenuItem => item !== null);
    }
}
