import { Component, ElementRef, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LayoutService } from './service/app.layout.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../demo/service/auth.service';
import { User } from '../store/user/model';
import { LoginService } from '../service-util/auth/login.service';

@Component({
    selector: 'app-menu-profile',
    templateUrl: './app.menuprofile.component.html',
    animations: [
        trigger('menu', [
            transition('void => inline', [
                style({ height: 0 }),
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)', style({ opacity: 1, height: '*' })),
            ]),
            transition('inline => void', [
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)', style({ opacity: 0, height: '0' })),
            ]),
            transition('void => overlay', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                animate('.12s cubic-bezier(0, 0, 0.2, 1)'),
            ]),
            transition('overlay => void', [
                animate('.1s linear', style({ opacity: 0 })),
            ]),
        ]),
    ],
    standalone: true,
    imports: [
        TooltipModule,
        NgClass,
        NgIf,
        RouterLink,
    ],
})
export class AppMenuProfileComponent implements OnInit {
    user: User | null = null; // ← cette ligne doit être ici, dans le corps de la classe

    constructor(public layoutService: LayoutService, public el: ElementRef, private loginService: LoginService, private router:Router) {}


ngOnInit(): void {
    
    this.user = this.loginService.getStoredUser();
}








    toggleMenu() {
        this.layoutService.onMenuProfileToggle();
    }

    get isHorizontal() {
        return (
            this.layoutService.isHorizontal() && this.layoutService.isDesktop()
        );
    }

    get menuProfileActive(): boolean {
        return this.layoutService.state.menuProfileActive;
    }

    get menuProfilePosition(): string {
        return this.layoutService.config().menuProfilePosition;
    }

    get isTooltipDisabled(): boolean {
        return !this.layoutService.isSlim();
    }



    logout() {
        this.loginService.logout();
        this.router.navigate(['/admin/login']);
      }
}
