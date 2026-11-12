import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Table, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar'; // PrimeNG 18+ : DatePickerModule / p-datepicker
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import * as XLSX from 'xlsx';

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

  exportExcel(): void {
    const list = this.quittances();

    if (!list.length) {
      return;
    }

    const fileName = this.buildExportFileName();
    const rows = list.map((q, index) => ({
      '#': index + 1,
      'N° quittance': q.numQuittance ?? '',
      'Date quittance': q.dateQuittance ? formatDate(new Date(q.dateQuittance), 'dd/MM/yyyy', 'en-US') : '',
      'Nom': q.nom ?? '',
      'IFU': q.ifu ?? '',
      'En commercial': q.enCommercial ?? '',
      'Opérateur': q.operateur ?? '',
      'Nature impôt': q.natImpot ?? '',
      'Impôt': q.impot ?? '',
      'Structure': q.structure ?? '',
      'Montant': q.montantImpot ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 16 },
      { wch: 25 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Quittances Impôt');
    XLSX.writeFile(workbook, fileName);
  }

  private buildExportFileName(): string {
    const month = this.dateDebut ? formatDate(this.dateDebut, 'yyyy_MM', 'en-US') : formatDate(new Date(), 'yyyy_MM', 'en-US');
    return `quittances_impot_${month}.xlsx`;
  }

  ngOnDestroy(): void {
    this.store.dispatch(QuittanceActions.reset());
  }
}