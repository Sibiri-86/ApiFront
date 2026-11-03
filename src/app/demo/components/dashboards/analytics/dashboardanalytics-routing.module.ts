import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardAnalyticsComponent } from './dashboardanalytics.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardAnalyticsComponent}
    ])],
    exports: [RouterModule]
})
export class DashboardAnalyticsRoutingModule { }