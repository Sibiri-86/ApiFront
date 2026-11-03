import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppsRoutingModule } from './apps-routing.module';


// NgRx
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from 'src/app/store/dashboard/reducer';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from 'src/app/store/dashboard/effect';

@NgModule({
  imports: [
    StoreModule.forFeature('dashboard', dashboardReducer),
    EffectsModule.forFeature([DashboardEffects])
  ],
  declarations: []
})
export class AppsModule {}