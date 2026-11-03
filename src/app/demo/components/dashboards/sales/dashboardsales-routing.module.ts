import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardSalesComponent } from './dashboardsales.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardSalesComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardSalesRoutingModule { }