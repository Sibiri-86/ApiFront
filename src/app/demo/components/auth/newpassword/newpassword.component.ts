import { Component } from '@angular/core';
import { AppConfigComponent } from '../../../../layout/config/app.config.component';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
    selector: 'app-newpassword',
    templateUrl: './newpassword.component.html',
    standalone: true,
    imports: [
        InputGroupModule,
        InputGroupAddonModule,
        PasswordModule,
        ButtonModule,
        RippleModule,
        AppConfigComponent,
    ],
})
export class NewPasswordComponent { }
