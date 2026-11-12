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

import { QuittanceTvmActions } from '../../store/tvm-consultation/action';
import { quittanceTvmFeature } from '../../store/tvm-consultation/reducer';

@Component({
  selector: 'app-quittance-tvm',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CalendarModule,
            ButtonModule, InputTextModule, MessageModule],
  templateUrl: './quittance-tvm.component.html',
})
export class QuittanceTvmComponent implements OnDestroy, OnInit {
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

                  ngOnInit(): void {
    this.rechercher();
  }
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

  exportExcel(): void {
    const list = this.quittances();

    if (!list.length) {
      return;
    }

    const fileName = this.buildExportFileName();
    const rows = list.map((q, index) => ({
      '#': index + 1,
      'N° quittance': q.numQuittance ?? '',
      'Date paiement': q.datePayement ? formatDate(new Date(q.datePayement), 'dd/MM/yyyy', 'en-US') : '',
      'Immatriculation': q.noImmat ?? '',
      'Identité': q.identite ?? '',
      'N° contribuable': q.numContribuable ?? '',
      'ID transaction': q.idTransaction ?? '',
      'Montant payé': q.montantPaye ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 18 },
      { wch: 16 },
      { wch: 18 },
      { wch: 35 },
      { wch: 18 },
      { wch: 22 },
      { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions TVM');
    XLSX.writeFile(workbook, fileName);
  }

  private buildExportFileName(): string {
    const month = this.dateDebut ? formatDate(this.dateDebut, 'yyyy_MM', 'en-US') : formatDate(new Date(), 'yyyy_MM', 'en-US');
    return `quittances_tvm_${month}.xlsx`;
  }

  ngOnDestroy(): void {
    this.store.dispatch(QuittanceTvmActions.reset());
  }
}
