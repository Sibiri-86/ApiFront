import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';   // PrimeNG 18+ : DatePickerModule / p-datepicker
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Table } from 'primeng/table';

import { QuittanceTvmActions } from '../../store/tvm-consultation/action';
import { quittanceTvmFeature } from '../../store/tvm-consultation/reducer';

@Component({
  selector: 'app-quittance-tvm',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CalendarModule,
            ButtonModule, InputTextModule, MessageModule],
  templateUrl: './quittance-tvm.component.html',
})
export class QuittanceTvmComponent implements OnDestroy {
  private store = inject(Store);

  quittances = this.store.selectSignal(quittanceTvmFeature.selectQuittances);
  loading    = this.store.selectSignal(quittanceTvmFeature.selectLoading);
  loaded     = this.store.selectSignal(quittanceTvmFeature.selectLoaded);
  error      = this.store.selectSignal(quittanceTvmFeature.selectError);
  total      = this.store.selectSignal(quittanceTvmFeature.selectTotalMontant);
  nombre     = this.store.selectSignal(quittanceTvmFeature.selectNombre);

  dateDebut: Date = new Date();
  dateFin: Date = new Date();

  globalFields = ['numQuittance', 'operateur', 'noImmat', 'identite',
                  'idTransaction', 'numContribuable', 'montantPaye'];

  rechercher(): void {
    if (!this.dateDebut || !this.dateFin || this.dateDebut > this.dateFin) return;
    this.store.dispatch(QuittanceTvmActions.load({
      dateDebut: formatDate(this.dateDebut, 'yyyy-MM-dd', 'en-US'),
      dateFin: formatDate(this.dateFin, 'yyyy-MM-dd', 'en-US'),
    }));
  }

  filtrer(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.store.dispatch(QuittanceTvmActions.reset());
  }
}