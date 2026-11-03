import { Component } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ModuleParam } from 'src/app/store/module-param/model';

@Component({
  selector: 'app-module-pram-detail',
  templateUrl: './module-pram-detail.component.html',
  styleUrl: './module-pram-detail.component.scss'
})
export class ModulePramDetailComponent {

  moduleParam: ModuleParam = {};

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.moduleParam = this.config.data.moduleParam;
  }

  close() {
    this.ref.close();
  }


}
