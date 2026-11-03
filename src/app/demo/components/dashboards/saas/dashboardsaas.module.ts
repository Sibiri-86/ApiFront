import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSaasRoutingModule } from './dashboardsaas-routing.module';
import { TagModule } from 'primeng/tag';
import { DashboardSaasComponent } from './dashboardsass.component';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DashboardSaasRoutingModule,
        TagModule,
        KnobModule,
        ChartModule,
        CheckboxModule,
        AvatarGroupModule,
        AvatarModule,
        ButtonModule,
        RippleModule,
        DashboardSaasComponent
    ]
})
export class DashboardSaasModule { }
