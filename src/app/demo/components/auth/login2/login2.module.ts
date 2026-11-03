import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login2RoutingModule } from './login2-routing.module';
import { Login2Component } from './login2.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

import { RippleModule } from 'primeng/ripple';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
@NgModule({
    imports: [
    CommonModule,
    Login2RoutingModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    FormsModule,
    RippleModule,
    InputGroupModule,
    InputGroupAddonModule,
    Login2Component
]
})
export class Login2Module { }
