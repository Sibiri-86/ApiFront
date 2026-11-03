import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordRoutingModule } from './forgotpassword-routing.module';
import { ForgotPasswordComponent } from './forgotpassword.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { RippleModule } from 'primeng/ripple';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
@NgModule({
    imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    ForgotPasswordRoutingModule,
    RippleModule,
    InputGroupModule,
    InputGroupAddonModule,
    ForgotPasswordComponent
]
})
export class ForgotPasswordModule { }