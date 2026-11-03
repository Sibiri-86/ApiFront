import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MailSidebarComponent } from './mail-sidebar/mail-sidebar.component';
import { ToastModule } from 'primeng/toast';

@Component({
    templateUrl: './mail.app.component.html',
    standalone: true,
    imports: [
        ToastModule,
        MailSidebarComponent,
        RouterOutlet,
    ],
})
export class MailAppComponent {}
