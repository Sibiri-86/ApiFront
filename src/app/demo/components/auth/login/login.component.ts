import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AppConfigComponent } from '../../../../layout/config/app.config.component';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    standalone: true,
    imports: [
        RouterLink,
        ButtonModule,
        RippleModule,
        InputTextModule,
        AppConfigComponent,
    ],
})
export class LoginComponent {
    rememberMe: boolean = false;

    constructor(private layoutService: LayoutService) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }
}
