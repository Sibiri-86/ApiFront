import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AppMenuitemComponent } from './app.menuitem.component';
import { NgFor, NgIf } from '@angular/common';
import { AccountService } from '../service-util/auth/account.service';

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
export class AppMenuComponent implements OnInit {

    model: MenuItem[] = [];

    constructor(private accountService: AccountService) {}

    ngOnInit(): void {
        // S'abonner aux changements d'authentification
        this.accountService.getAuthenticationState().subscribe(() => {
            this.buildMenu();
        });

        // Construire le menu initial
        this.buildMenu();
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
        // roles: ['PARAMTRAGE'],
        items: [
            {
                label: 'Utilisateurs',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/admin/user'],
                // roles: ['UTILISATEUR'],
            },
            {
                label: 'Opérateurs',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/admin/operateurs'],
            },
            {
                label: 'Module',
                icon: 'pi pi-fw pi-th-large',
                routerLink: ['/admin/module-param'],
                // roles: ['MODULE'],
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
                routerLink: ['/admin/tvm-verification']
            },
            {
                label: 'Consultation',
                icon: 'pi pi-fw pi-list',
                routerLink: ['/admin/quittance-tvm']
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
                routerLink: ['/admin/tr-verification']
            },
            {
                label: 'Consultation',
                icon: 'pi pi-fw pi-list',
                routerLink: ['/admin/quittance-tr']
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
                routerLink: ['/admin/quittance-impot']
            },
        ]
    },
];

        // Filtrer le menu en fonction des rôles de l'utilisateur
        this.model = this.filterMenuByRoles(fullMenu);
    }

    private filterMenuByRoles(menuItems: MenuItem[]): MenuItem[] {
        return menuItems
            .map(item => {
                // Créer une copie de l'item
                const filteredItem: MenuItem = { ...item };

                // Si l'item a des sous-items, les filtrer récursivement
                if (filteredItem.items && Array.isArray(filteredItem.items)) {
                    filteredItem.items = filteredItem.items.filter((subItem: MenuItem) => {
                        // Si le sous-item a des rôles requis, vérifier l'accès
                        if (subItem.roles && Array.isArray(subItem.roles)) {
                            return this.accountService.hasAnyAuthority(subItem.roles);
                        }
                        // Si pas de rôles requis, afficher l'item
                        return true;
                    });

                    // Si après filtrage il ne reste aucun sous-item, ne pas afficher le groupe
                    if (filteredItem.items.length === 0) {
                        return null;
                    }
                }

                // Vérifier les rôles du groupe parent
                if (filteredItem.roles && Array.isArray(filteredItem.roles)) {
                    if (!this.accountService.hasAnyAuthority(filteredItem.roles)) {
                        return null;
                    }
                }

                return filteredItem;
            })
            .filter((item): item is MenuItem => item !== null); // Retirer les items null
    }
}
