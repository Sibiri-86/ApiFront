import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WizardComponent } from './wizard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WizardComponent }
    ])],
    exports: [RouterModule]
})
export class WizardRoutingModule { }
