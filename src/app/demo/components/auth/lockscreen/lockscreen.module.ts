import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LockScreenRoutingModule } from './lockscreen-routing.module';
import { LockScreenComponent } from './lockscreen.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { AvatarModule } from 'primeng/avatar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    LockScreenRoutingModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    InputGroupModule,
    InputGroupAddonModule,
    LockScreenComponent
]
})
export class LockScreenModule { }
