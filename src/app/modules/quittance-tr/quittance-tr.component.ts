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

import { QuittanceTrActions } from '../../store/tr-consultation/action';
import { quittanceTrFeature } from '../../store/tr-consultation/reducer';

@Component({
  selector: 'app-quittance-tr',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CalendarModule,
            ButtonModule, InputTextModule, MessageModule],
  templateUrl: './quittance-tr.component.html',
})
export class QuittancetrComponent implements OnDestroy {
  private store = inject(Store);

  quittances = this.store.selectSignal(quittanceTrFeature.selectQuittances);
  loading    = this.store.selectSignal(quittanceTrFeature.selectLoading);
  loaded     = this.store.selectSignal(quittanceTrFeature.selectLoaded);
  error      = this.store.selectSignal(quittanceTrFeature.selectError);
  total      = this.store.selectSignal(quittanceTrFeature.selectTotalMontant);
  nombre     = this.store.selectSignal(quittanceTrFeature.selectNombre);

  dateDebut: Date = new Date();
  dateFin: Date = new Date();

  globalFields = ['numQuittance', 'operateur', 'noImmat', 'identite',
                  'idTransaction', 'numContribuable', 'montantPaye'];

  rechercher(): void {
    if (!this.dateDebut || !this.dateFin || this.dateDebut > this.dateFin) return;
    this.store.dispatch(QuittanceTrActions.load({
      dateDebut: formatDate(this.dateDebut, 'yyyy-MM-dd', 'en-US'),
      dateFin: formatDate(this.dateFin, 'yyyy-MM-dd', 'en-US'),
    }));
  }

  filtrer(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.store.dispatch(QuittanceTrActions.reset());
  }
}