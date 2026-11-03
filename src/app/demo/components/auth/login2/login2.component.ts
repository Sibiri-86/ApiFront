import { Component } from '@angular/core';
import { AppConfigComponent } from '../../../../layout/config/app.config.component';
import { RouterLink } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
    templateUrl: './login2.component.html',
    standalone: true,
    imports: [
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        RouterLink,
        AppConfigComponent,
    ],
})
export class Login2Component {
    rememberMe: boolean = false;
}
