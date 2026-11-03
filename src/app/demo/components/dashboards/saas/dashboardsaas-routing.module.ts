import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardSaasComponent } from './dashboardsass.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardSaasComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardSaasRoutingModule { }