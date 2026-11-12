import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';   // PrimeNG 18+ : DatePickerModule / p-datepicker
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';

import { QuittanceTrActions } from '../../store/tr-consultation/action';
import { quittanceTrFeature } from '../../store/tr-consultation/reducer';

@Component({
  selector: 'app-quittance-tr',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CalendarModule,
            ButtonModule, InputTextModule, MessageModule],
  templateUrl: './quittance-tr.component.html',
})
export class QuittancetrComponent implements OnDestroy, OnInit {
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


ngOnInit(): void {
    this.rechercher();
  }
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

  exportExcel(): void {
    const list = this.quittances();

    if (!list.length) {
      return;
    }

    const fileName = this.buildExportFileName();
    const rows = list.map((q, index) => ({
      '#': index + 1,
      'N° quittance': q.numeroQuittance ?? '',
      'Date paiement': q.datePaiement ?? '',
      'Identité': [q.nom, q.prenom].filter(Boolean).join(' ').trim() || '',
      'N° contribuable': q.vcodeContribuable ?? '',
      'ID transaction': q.idTransaction ?? '',
      'Téléphone': q.telephone ?? '',
      'Montant payé': q.montantPaye ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 16 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions TR');
    XLSX.writeFile(workbook, fileName);
  }

  private buildExportFileName(): string {
    const month = this.dateDebut ? formatDate(this.dateDebut, 'yyyy_MM', 'en-US') : formatDate(new Date(), 'yyyy_MM', 'en-US');
    return `quittances_tr_${month}.xlsx`;
  }

  ngOnDestroy(): void {
    this.store.dispatch(QuittanceTrActions.reset());
  }
}
