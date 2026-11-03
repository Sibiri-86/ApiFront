import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar'; // PrimeNG 18+ : DatePickerModule / p-datepicker
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { QuittanceActions } from '../../store/quittance-impot/action';
import { quittanceFeature } from '../../store/quittance-impot/reducer';

@Component({
  selector: 'app-quittance-impot',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CalendarModule,
            ButtonModule, InputTextModule, MessageModule],
  templateUrl: './quittance-impot.component.html',
})
export class QuittanceImpotComponent implements OnDestroy, OnInit {
  private store = inject(Store);

  quittances = this.store.selectSignal(quittanceFeature.selectQuittances);
  loading    = this.store.selectSignal(quittanceFeature.selectLoading);
  loaded     = this.store.selectSignal(quittanceFeature.selectLoaded);
  error      = this.store.selectSignal(quittanceFeature.selectError);
  total      = this.store.selectSignal(quittanceFeature.selectTotalMontant);
  nombre     = this.store.selectSignal(quittanceFeature.selectNombre);

  dateDebut: Date = new Date();
  dateFin: Date = new Date();


  ngOnInit(): void {
    this.rechercher();
  }
  /** Colonnes : pilotent l'en-tête, le corps et l'export CSV */
  cols = [
    { field: 'numQuittance',  header: 'N° quittance' },
    { field: 'dateQuittance', header: 'Date quittance' },
    { field: 'nom',           header: 'Nom' },
    { field: 'ifu',           header: 'IFU' },
    { field: 'enCommercial',  header: 'En commercial' },
    { field: 'operateur',     header: 'Opérateur' },
    { field: 'natImpot',      header: 'Nature impôt' },
    { field: 'impot',         header: 'Impôt' },
    { field: 'structure',     header: 'Structure' },
    { field: 'montantImpot',  header: 'Montant' },
  ];

  globalFields = this.cols.map((c) => c.field);

  rechercher(): void {
    if (!this.dateDebut || !this.dateFin || this.dateDebut > this.dateFin) return;
    this.store.dispatch(QuittanceActions.load({
      dateDebut: formatDate(this.dateDebut, 'yyyy-MM-dd', 'en-US'),
      dateFin: formatDate(this.dateFin, 'yyyy-MM-dd', 'en-US'),
    }));
  }

  filtrer(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.store.dispatch(QuittanceActions.reset());
  }
}