import {CommonModule} from '@angular/common';
import {Component, OnDestroy, OnInit, SecurityContext} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {PaginatorModule} from 'primeng/paginator';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TooltipModule} from 'primeng/tooltip';
import {DropdownModule} from 'primeng/dropdown';
import {select, Store} from '@ngrx/store';
import {debounceTime, filter, firstValueFrom, Observable, Subject, take, takeUntil, timeout} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import * as tacheAction from '../../store/tache/action';
import * as tacheSelector from '../../store/tache/selector';


import {AppState} from 'src/app/store/app.state';
import {Courrier, SourceDestination, SuiviCourrier} from 'src/app/store/courrier/model';
import {PieceJointe, Tache} from 'src/app/store/tache/model';
import * as courrierAction from 'src/app/store/courrier/action';
import * as courrierSelector from 'src/app/store/courrier/selector';
import * as XLSX from 'xlsx';
import {Agent} from 'src/app/store/agent/model';
import {CalendarModule} from 'primeng/calendar';
import {TabViewModule} from 'primeng/tabview';
import {FileUploadModule} from 'primeng/fileupload';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MultiSelectModule} from 'primeng/multiselect';
import {AccordionModule} from 'primeng/accordion';
import {TimelineModule} from 'primeng/timeline';
import {CardModule} from 'primeng/card';
import {ChipModule} from 'primeng/chip';
import {PanelModule} from 'primeng/panel';
import {TagModule} from 'primeng/tag';

interface Statistiques {
    total: number;
    entrants: number;
    sortants: number;
    enTraitement: number;
}

@Component({
    selector: 'app-registre-courrier',
    standalone: true,
    templateUrl: './registre-courrier.component.html',
    styleUrls: ['./registre-courrier.component.scss'],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RippleModule,
        TooltipModule,
        ToolbarModule,
        ToastModule,
        InputTextModule,
        ReactiveFormsModule,
        PaginatorModule,
        DialogModule,
        ConfirmDialogModule,
        DropdownModule, CalendarModule, TabViewModule, FileUploadModule,
        TagModule, SplitButtonModule, MultiSelectModule,
        AccordionModule,
        TimelineModule,
        CardModule,
        ChipModule,
        PanelModule
    ],
    providers: [MessageService, ConfirmationService]
})
export class RegistreCourrierComponent implements OnInit, OnDestroy {
    destroy$ = new Subject<boolean>();

    courriersRegistre: Courrier[] = [];
    courrierSelectionne: Courrier = {};
    pieceJointes: PieceJointe[] = [];
    agentList$!: Observable<Array<Agent>>;
    tacheList$!: Observable<Tache[]>;
    agentList!: Array<Agent>;
    courrierDetail: Courrier = {};

    loading = false;
    detailsDialog = false;

    registreForm!: FormGroup;

    typeOptions: any[] = [];
    sensOptions: any[] = [];

    statistiques: Statistiques = {
        total: 0,
        entrants: 0,
        sortants: 0,
        enTraitement: 0
    };

    // Pour la visualisation des fichiers
    fileViewDialog = false;
    filePreviewUrl: any;
    fileTextContent = '';
    selectedFileName = '';
    selectedFileType = '';
    currentPieceJointe: any;
    suiviCourrier: SuiviCourrier = {taches: [], historiqueImputation: []};
    suiviCourrierDialog = false;
    loadingSuivi = false;
    labelDestOrExpe = ''
    popupHeader = '';

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit(): void {
        this.initializeForm();
        this.initializeOptions();
        this.loadCourriers();
        this.subscribeToStore();
    }

    private initializeForm(): void {
        const dateDebut = new Date();
        dateDebut.setMonth(dateDebut.getMonth() - 1);

        this.registreForm = this.fb.group({
            dateDebut: new FormControl(this.formatDate(dateDebut)),
            dateFin: new FormControl(this.formatDate(new Date())),
            typeCourrier: new FormControl(null),
            sourceDestination: new FormControl(null)
        });
    }

    private initializeOptions(): void {
        this.typeOptions = [
            {label: 'Inter DGI', value: 'INTERNE'},
            {label: 'Externe', value: 'EXTERNE'}
        ];

        this.sensOptions = [
            {label: 'Entrant', value: 'ENTRANT'},
            {label: 'Sortant', value: 'SORTANT'}
        ];
    }

    private loadCourriers(): void {
        this.loading = true;
        this.store.dispatch(courrierAction.loadCourrier({
            search: this.registreForm.value
        }));
    }

    private subscribeToStore(): void {
        this.store.pipe(
            select(courrierSelector.CourrierList),
            takeUntil(this.destroy$)
        ).subscribe(data => {
            this.loading = false;
            if (data) {
                this.courriersRegistre = this.filterCourriers(data);
                this.calculateStatistics();
            }
        });

        this.store.pipe(
            select(courrierSelector.pieceJointeList),
            takeUntil(this.destroy$)
        ).subscribe(data => {
            this.pieceJointes = data;
        });
    }

    private filterCourriers(courriers: Courrier[]): Courrier[] {
        let filtered = [...courriers];
        const formValue = this.registreForm.value;

        if (formValue.typeCourrier) {
            filtered = filtered.filter(c => c.typeCourrier === formValue.typeCourrier);
        }

        if (formValue.sourceDestination) {
            filtered = filtered.filter(c => c.sourceDestination === formValue.sourceDestination);
        }

        return filtered;
    }

    private calculateStatistics(): void {
        this.statistiques = {
            total: this.courriersRegistre.length,
            entrants: this.courriersRegistre.filter(c => c.sourceDestination === SourceDestination.ENTRANT).length,
            sortants: this.courriersRegistre.filter(c => c.sourceDestination === SourceDestination.SORTANT).length,
            enTraitement: this.courriersRegistre.filter(c => c.isReceptionne).length
        };
    }

    rechercherCourriers(): void {
        const formValue = this.registreForm.value;

        if (new Date(formValue.dateDebut) > new Date(formValue.dateFin)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'La date de début doit être inférieure à la date de fin'
            });
            return;
        }

        this.loadCourriers();
    }

    voirDetails(courrier: Courrier): void {
        this.courrierSelectionne = courrier;
        this.popupHeader = " Détail du courrier";

        if (courrier.id) {
            this.store.dispatch(courrierAction.loadPieceJointe({
                idCourrier: courrier.id
            }));
        }
        if (courrier.isImputer) {

            this.chargerSuiviCourrier(courrier);
        }

        this.detailsDialog = true;
    }

    cancelDetail() {
        this.detailsDialog = false;

    }

    chargerSuiviCourrier(courrier: Courrier): void {
        this.loadingSuivi = true;

        // Dispatch une action pour charger les tâches liées au courrier
        if (courrier.id) {
            this.store.dispatch(tacheAction.loadTachesByCourrierId({courrierId: courrier.id}));
            this.tacheList$ = this.store.pipe(select(tacheSelector.selectTachesByCourrierId(courrier.id)));

            this.tacheList$
                .pipe(takeUntil(this.destroy$))
                .subscribe(value => {
                    if (value) {
                        this.suiviCourrier.taches = value;


                        this.loadingSuivi = false;

                        console.log('Tâches chargées:', value);
                        console.log('Historique généré:', this.suiviCourrier.historiqueImputation);
                    }
                });
        }


    }

    /**
     * Impression d'une fiche de courrier individuelle
     */
    imprimerFiche(courrier: Courrier): void {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Popup bloqué',
                detail: 'Veuillez autoriser les popups pour imprimer'
            });
            return;
        }

        const htmlContent = this.generateFicheHTML(courrier);
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    /**
     * Génération du HTML pour la fiche de courrier
     */
    private generateFicheHTML(courrier: Courrier): string {
        const styles = `
            <style>
                @page { size: A4; margin: 2cm; }
                body {
                    font-family: Arial, sans-serif;
                    font-size: 11pt;
                    line-height: 1.6;
                    color: #333;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #2c3e50;
                    padding-bottom: 15px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #2c3e50;
                    margin: 0;
                    font-size: 24pt;
                }
                .header .subtitle {
                    color: #7f8c8d;
                    font-size: 10pt;
                    margin-top: 5px;
                }
                .section {
                    margin-bottom: 25px;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-left: 4px solid #3498db;
                }
                .section-title {
                    color: #2c3e50;
                    font-size: 14pt;
                    font-weight: bold;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                }
                .info-row {
                    display: flex;
                    margin-bottom: 10px;
                    page-break-inside: avoid;
                }
                .info-label {
                    font-weight: bold;
                    width: 180px;
                    color: #555;
                }
                .info-value {
                    flex: 1;
                    color: #333;
                }
                .badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 9pt;
                    font-weight: bold;
                }
                .badge-success { background-color: #d4edda; color: #155724; }
                .badge-warning { background-color: #fff3cd; color: #856404; }
                .badge-info { background-color: #d1ecf1; color: #0c5460; }
                .badge-primary { background-color: #cce5ff; color: #004085; }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 9pt;
                    color: #7f8c8d;
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #3498db;
                    color: white;
                }
            </style>
        `;

        const statut = this.getStatutLabel(courrier);
        const statutClass = !courrier.isReceptionne ? 'badge-info' :
            courrier.isReceptionne ? 'badge-success' : 'badge-primary';

        const typeLabel = courrier.typeCourrier === 'INTERNE' ? 'Inter DGI' : 'Externe';
        const sensLabel = courrier.sourceDestination === 'ENTRANT' ? 'Entrant' : 'Sortant';
        const sensClass = courrier.sourceDestination === 'ENTRANT' ? 'badge-success' : 'badge-warning';

        // Informations pièces jointes
        let piecesJointesHTML = '';
        if (this.pieceJointes && this.pieceJointes.length > 0) {
            const pjRows = this.pieceJointes.map((pj, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${pj.name || this.getFileName(pj.chemin || '')}</td>
                    <td>${this.formatFileSize(pj.tailleFichier || 0)}</td>
                </tr>
            `).join('');

            piecesJointesHTML = `
                <div class="section">
                    <div class="section-title">📎 Pièces Jointes</div>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 40px;">N°</th>
                                <th>Nom du fichier</th>
                                <th style="width: 100px;">Taille</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pjRows}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            piecesJointesHTML = `
                <div class="section">
                    <div class="section-title">📎 Pièces Jointes</div>
                    <p style="color: #7f8c8d; font-style: italic;">Aucune pièce jointe</p>
                </div>
            `;
        }

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Fiche Courrier ${courrier.numero}</title>
                ${styles}
            </head>
            <body>
                <div class="header">
                    <h1>FICHE DE COURRIER</h1>
                    <div class="subtitle">Numéro: ${courrier.numero || 'N/A'}</div>
                </div>

                <div class="section">
                    <div class="section-title">📋 Informations Générales</div>
                    <div class="info-row">
                        <div class="info-label">Numéro du courrier:</div>
                        <div class="info-value"><strong>${courrier.numero || 'N/A'}</strong></div>
                    </div>
                    ${courrier.numeroReception ? `
                    <div class="info-row">
                        <div class="info-label">Numéro de réception:</div>
                        <div class="info-value"><strong>${courrier.numeroReception}</strong></div>
                    </div>
                    ` : ''}
                    <div class="info-row">
                        <div class="info-label">Date:</div>
                        <div class="info-value">${this.formatDateFr(courrier.dateReception)}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Type de courrier:</div>
                        <div class="info-value">
                            <span class="badge badge-primary">${typeLabel}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Sens:</div>
                        <div class="info-value">
                            <span class="badge ${sensClass}">${sensLabel}</span>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Statut:</div>
                        <div class="info-value">
                            <span class="badge ${statutClass}">${statut}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">📍 Provenance / Destination</div>
                    <div class="info-row">
                        <div class="info-label">${courrier.sourceDestination === 'ENTRANT' ? 'Provenance:' : 'Destination:'}</div>
                        <div class="info-value">${this.getProvenanceDestination(courrier)}</div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">📝 Objet du Courrier</div>
                    <p style="margin: 10px 0; line-height: 1.8;">
                        ${courrier.objet || 'Aucun objet spécifié'}
                    </p>
                </div>

                ${piecesJointesHTML}

                <div class="footer">
                    <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
                    <p>Registre des Courriers - Direction Générale des Impôts</p>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Export du registre en PDF
     * Utilise jsPDF et jspdf-autotable
     */
    async exportPDF(): Promise<void> {
        try {
            this.loading = true;

            // Vérification de jsPDF
            if (typeof window === 'undefined' || !(window as any).jspdf) {
                await this.exportPDFWithoutLibrary();
                return;
            }

            const mode = this.getCourrierDisplayMode();
            const sortantSeul = mode === 'sortant';
            const provDestLabel = this.getProvenanceDestinationLabel(mode);
            const dateRecepLabel = this.getDateReceptionLabel(mode);

            // Charger les tâches exactement comme pour Excel (inutile si sortant seul)
            const tachesParCourrier = sortantSeul
                ? new Map<number, Tache[]>()
                : await this.chargerTachesPourExport();

            const {jsPDF} = (window as any).jspdf;

            // A4 paysage
            const doc = new jsPDF('l', 'mm', 'a4');

            const today = new Date();
            const dateStr = today.toLocaleDateString('fr-FR');

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // =====================================================
            // EN-TÊTE
            // =====================================================

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);

            doc.text(
                'REGISTRE DES COURRIERS',
                pageWidth / 2,
                12,
                {align: 'center'}
            );

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            const periode =
                `Période: ${this.formatDateFr(this.registreForm.value.dateDebut)} au ` +
                `${this.formatDateFr(this.registreForm.value.dateFin)}`;

            doc.text(
                periode,
                pageWidth / 2,
                19,
                {align: 'center'}
            );

            doc.text(
                `Édité le: ${dateStr}`,
                pageWidth - 10,
                12,
                {align: 'right'}
            );

            // =====================================================
            // STATISTIQUES
            // =====================================================

            doc.setFontSize(8);

            doc.text(
                `Total: ${this.statistiques.total} | ` +
                `Entrants: ${this.statistiques.entrants} | ` +
                `Sortants: ${this.statistiques.sortants} | ` +
                `En traitement: ${this.statistiques.enTraitement}`,
                10,
                26
            );

            // =====================================================
            // COLONNES
            // =====================================================

            const headers = sortantSeul
                ? [['N°', 'Numéro', dateRecepLabel, provDestLabel, 'Objet']]
                : [[
                    'N°',
                    'Numéro',
                    'N° Réception',
                    dateRecepLabel,
                    'Date Courrier',
                    provDestLabel,
                    'Objet',
                    'Service(s)',
                    'Agent(s)',
                    'Instruction(s)'
                ]];

            // =====================================================
            // DONNÉES
            // =====================================================

            const data = this.courriersRegistre.map((courrier, index) => {

                if (sortantSeul) {
                    return [
                        (index + 1).toString(),
                        courrier.numero || '-',
                        this.formatDateFr(courrier.dateReception),
                        this.getProvenanceDestination(courrier) || '-',
                        courrier.objet || '-'
                    ];
                }

                const taches = courrier.id
                    ? (tachesParCourrier.get(courrier.id) || [])
                    : [];

                const agentsImputes = this.getAgentsImputes(taches);
                const servicesImputes = this.getServicesImputes(taches);
                const instructionsImputees = this.getInstructionsImputees(taches);

                return [
                    (index + 1).toString(),
                    courrier.numero || '-',
                    courrier.numeroReception || '-',
                    this.formatDateFr(courrier.dateReception),
                    this.formatDateFr(courrier.dateCourrier),
                    this.getProvenanceDestination(courrier) || '-',
                    courrier.objet || '-',
                    servicesImputes || '-',
                    agentsImputes || '-',
                    instructionsImputees || '-'
                ];
            });

            // =====================================================
            // LARGEURS DE COLONNES
            // Total = 277 mm dans les deux cas
            // =====================================================

            const columnStyles = sortantSeul
                ? {
                    0: {cellWidth: 10, halign: 'center'},   // N°
                    1: {cellWidth: 35},                      // Numéro
                    2: {cellWidth: 30, halign: 'center'},    // Date
                    3: {cellWidth: 100},                     // Destination
                    4: {cellWidth: 102}                      // Objet
                }
                : {
                    0: {cellWidth: 8, halign: 'center'},    // N°
                    1: {cellWidth: 18},                      // Numéro
                    2: {cellWidth: 18},                      // N° Réception
                    3: {cellWidth: 18, halign: 'center'},    // Date
                    4: {cellWidth: 18, halign: 'center'},    // Date Courrier
                    5: {cellWidth: 32},                       // Provenance/Destination
                    6: {cellWidth: 34},                       // Objet
                    7: {cellWidth: 26},                       // Service(s)
                    8: {cellWidth: 27},                       // Agent(s)
                    9: {cellWidth: 28}                        // Instruction(s)
                };

            // =====================================================
            // TABLEAU PDF
            // =====================================================

            (doc as any).autoTable({
                head: headers,
                body: data,

                startY: 30,

                theme: 'grid',

                tableWidth: 277,

                margin: {
                    left: 10,
                    right: 10,
                    bottom: 15
                },

                styles: {
                    font: 'helvetica',
                    fontSize: 6.5,
                    cellPadding: 1.2,
                    lineColor: [190, 190, 190],
                    lineWidth: 0.1,
                    overflow: 'linebreak',
                    valign: 'middle'
                },

                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 6.5,
                    halign: 'center',
                    valign: 'middle'
                },

                bodyStyles: {
                    textColor: [40, 40, 40]
                },

                alternateRowStyles: {
                    fillColor: [245, 248, 250]
                },

                columnStyles: columnStyles,

                // =================================================
                // PIED DE PAGE
                // =================================================

                didDrawPage: (data: any) => {

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(7);

                    doc.text(
                        `Page ${data.pageNumber}`,
                        pageWidth - 10,
                        pageHeight - 6,
                        {
                            align: 'right'
                        }
                    );
                }
            });

            // =====================================================
            // NOM DU FICHIER
            // =====================================================

            const filename =
                `registre_courriers_` +
                `${today.getFullYear()}` +
                `${(today.getMonth() + 1).toString().padStart(2, '0')}` +
                `${today.getDate().toString().padStart(2, '0')}.pdf`;

            doc.save(filename);

            this.messageService.add({
                severity: 'success',
                summary: 'Export réussi',
                detail: 'Le registre a été exporté en PDF avec succès'
            });

        } catch (error) {

            console.error('Erreur export PDF:', error);

            this.messageService.add({
                severity: 'error',
                summary: "Erreur d'export",
                detail: "Une erreur est survenue lors de l'export PDF"
            });

        } finally {
            this.loading = false;
        }
    }


    /**
     * Export PDF sans bibliothèque (méthode alternative)
     */
    /**
     * Export PDF sans bibliothèque (méthode alternative)
     */
    private async exportPDFWithoutLibrary(): Promise<void> {
        const mode = this.getCourrierDisplayMode();
        const sortantSeul = mode === 'sortant';

        const tachesParCourrier = sortantSeul
            ? new Map<number, Tache[]>()
            : await this.chargerTachesPourExport();

        const htmlContent = this.generatePrintableHTML(tachesParCourrier);

        // Iframe invisible, ne perturbe pas l'app Angular
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) {
            this.messageService.add({
                severity: 'error',
                summary: "Erreur d'export",
                detail: "Impossible de préparer l'impression"
            });
            document.body.removeChild(iframe);
            return;
        }

        doc.open();
        doc.write(htmlContent);
        doc.close();

        // Nettoyage après l'impression (ou après un délai de sécurité)
        const cleanup = () => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        };

        iframe.contentWindow?.addEventListener('afterprint', cleanup);

        // Laisser le temps au navigateur de rendre le contenu avant d'imprimer
        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            // Filet de sécurité si 'afterprint' n'est pas déclenché (Safari...)
            setTimeout(cleanup, 1000);
        }, 250);

        this.messageService.add({
            severity: 'info',
            summary: 'Export PDF',
            detail: "La fenêtre d'impression va s'ouvrir"
        });
    }

    private generatePrintableHTML(
        tachesParCourrier: Map<number, any[]> = new Map()
    ): string {

        const mode = this.getCourrierDisplayMode();
        const sortantSeul = mode === 'sortant';
        const provDestLabel = this.getProvenanceDestinationLabel(mode);
        const dateRecepLabel = this.getDateReceptionLabel(mode);

        const styles = `
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 8pt;
            color: #282828;
            margin: 0;
            padding: 0;
        }

        h1 {
            text-align: center;
            color: #2c3e50;
            font-size: 18pt;
            margin: 0 0 4px 0;
        }

        .info {
            position: relative;
            text-align: center;
            color: #7f8c8d;
            font-size: 9pt;
            margin-bottom: 8px;
        }

        .date-edition {
            position: absolute;
            right: 0;
            top: 0;
            text-align: right;
            font-size: 8pt;
        }

        .stats {
            margin: 8px 0;
            padding: 6px 8px;
            background-color: #ecf0f1;
            border: 1px solid #d5d8dc;
            font-size: 8pt;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-top: 8px;
        }

        th,
        td {
            border: 1px solid #c8c8c8;
            padding: 4px;
            vertical-align: middle;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        th {
            background-color: #2980b9;
            color: white;
            font-weight: bold;
            text-align: center;
            font-size: 7.5pt;
        }

        td {
            font-size: 7.5pt;
        }

        tbody tr:nth-child(even) {
            background-color: #f5f8fa;
        }

        .center {
            text-align: center;
        }

        /*
         * Largeurs colonnes — mode complet (10 colonnes)
         */
        .col-num {
            width: 3%;
        }

        .col-numero {
            width: 7%;
        }

        .col-reception {
            width: 7%;
        }

        .col-date-reception {
            width: 7%;
        }

        .col-date-courrier {
            width: 7%;
        }

        .col-provenance {
            width: 12%;
        }

        .col-objet {
            width: 14%;
        }

        .col-services {
            width: 11%;
        }

        .col-agents {
            width: 12%;
        }

        .col-instructions {
            width: 20%;
        }

        /*
         * Largeurs colonnes — mode réduit sortants (5 colonnes)
         */
        .col-num-reduit {
            width: 5%;
        }

        .col-numero-reduit {
            width: 15%;
        }

        .col-date-reception-reduit {
            width: 12%;
        }

        .col-provenance-reduit {
            width: 33%;
        }

        .col-objet-reduit {
            width: 35%;
        }

        thead {
            display: table-header-group;
        }

        tr {
            page-break-inside: avoid;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .stats,
            th {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
`;

        // =====================================================
        // STATISTIQUES
        // =====================================================

        const statsHtml = `
    <div class="stats">
        <strong>Statistiques :</strong>
        Total: ${this.statistiques.total}
        &nbsp;|&nbsp;
        Entrants: ${this.statistiques.entrants}
        &nbsp;|&nbsp;
        Sortants: ${this.statistiques.sortants}
        &nbsp;|&nbsp;
        En traitement: ${this.statistiques.enTraitement}
    </div>
`;

        // =====================================================
        // EN-TÊTE DU TABLEAU
        // =====================================================

        const tableHead = sortantSeul
            ? `
        <tr>
            <th class="col-num-reduit">N°</th>
            <th class="col-numero-reduit">Numéro</th>
            <th class="col-date-reception-reduit">${dateRecepLabel}</th>
            <th class="col-provenance-reduit">${provDestLabel}</th>
            <th class="col-objet-reduit">Objet</th>
        </tr>
    `
            : `
        <tr>
            <th class="col-num">N°</th>
            <th class="col-reception">N° Réception</th>
            <th class="col-numero">Numéro</th>
            <th class="col-date-reception">${dateRecepLabel}</th>
            <th class="col-date-courrier">Date Courrier</th>
            <th class="col-provenance">${provDestLabel}</th>
            <th class="col-objet">Objet</th>
            <th class="col-services">Service(s)</th>
            <th class="col-agents">Agent(s)</th>
            <th class="col-instructions">Instruction(s)</th>
        </tr>
    `;

        // =====================================================
        // LIGNES DU TABLEAU
        // =====================================================

        const tableRows = this.courriersRegistre.map((courrier, index) => {

            if (sortantSeul) {
                return `
            <tr>
                <td class="center">${index + 1}</td>
                <td>${courrier.numero || '-'}</td>
                <td class="center">${this.formatDateFr(courrier.dateReception)}</td>
                <td>${this.getProvenanceDestination(courrier) || '-'}</td>
                <td>${courrier.objet || '-'}</td>
            </tr>
        `;
            }

            const taches = courrier.id
                ? (tachesParCourrier.get(courrier.id) || [])
                : [];

            const agentsImputes = this.getAgentsImputes(taches);
            const servicesImputes = this.getServicesImputes(taches);
            const instructionsImputees = this.getInstructionsImputees(taches);

            return `
        <tr>
            <td class="center">${index + 1}</td>
            <td>${courrier.numeroReception || '-'}</td>
            <td>${courrier.numero || '-'}</td>
            <td class="center">${this.formatDateFr(courrier.dateReception)}</td>
            <td class="center">${this.formatDateFr(courrier.dateCourrier)}</td>
            <td>${this.getProvenanceDestination(courrier) || '-'}</td>
            <td>${courrier.objet || '-'}</td>
            <td>${servicesImputes || '-'}</td>
            <td>${agentsImputes || '-'}</td>
            <td>${instructionsImputees || '-'}</td>
        </tr>
    `;
        }).join('');

        // =====================================================
        // DOCUMENT HTML
        // =====================================================

        return `
    <!DOCTYPE html>

    <html lang="fr">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>Registre des Courriers</title>

        ${styles}
    </head>

    <body>

        <h1>REGISTRE DES COURRIERS</h1>

        <div class="info">

            <div>
                Période:
                ${this.formatDateFr(this.registreForm.value.dateDebut)}
                au
                ${this.formatDateFr(this.registreForm.value.dateFin)}
            </div>

            <div class="date-edition">
                Édité le:
                ${new Date().toLocaleDateString('fr-FR')}
            </div>

        </div>

        ${statsHtml}

        <table>

            <thead>
                ${tableHead}
            </thead>

            <tbody>
                ${tableRows}
            </tbody>

        </table>

    </body>

    </html>
`;
    }

    /**
     * Export du registre en Excel
     * Utilise la bibliothèque XLSX
     */
    async exportExcel(): Promise<void> {
        try {
            this.loading = true;

            const mode = this.getCourrierDisplayMode();
            const sortantSeul = mode === 'sortant';
            const provDestLabel = this.getProvenanceDestinationLabel(mode);
            const dateRecepLabel = this.getDateReceptionLabel(mode);

            const tachesParCourrier = sortantSeul
                ? new Map<number, Tache[]>()
                : await this.chargerTachesPourExport();

            const headers = sortantSeul
                ? ['N°', 'Numéro', dateRecepLabel, provDestLabel, 'Objet']
                : ['N°', 'N° Réception', 'Numéro', dateRecepLabel, 'Date Courrier', provDestLabel, 'Objet', 'Service(s)', 'Agent(s)', 'Instruction(s)'];

            const lastColIndex = headers.length - 1;

            const worksheetData = [
                ['REGISTRE DES COURRIERS'],
                [],
                [`Période: ${this.formatDateFr(this.registreForm.value.dateDebut)} au ${this.formatDateFr(this.registreForm.value.dateFin)}`],
                [`Édité le: ${new Date().toLocaleDateString('fr-FR')}`],
                [],
                ['STATISTIQUES'],
                ['Total des courriers:', this.statistiques.total],
                ['Courriers entrants:', this.statistiques.entrants],
                ['Courriers sortants:', this.statistiques.sortants],
                ['En traitement:', this.statistiques.enTraitement],
                [],
                headers
            ];

            this.courriersRegistre.forEach((courrier, index) => {
                if (sortantSeul) {
                    worksheetData.push([
                        index + 1,
                        courrier.numero || '-',
                        this.formatDateFr(courrier.dateReception),
                        this.getProvenanceDestination(courrier),
                        courrier.objet || '-'
                    ]);
                } else {
                    const taches = courrier.id ? (tachesParCourrier.get(courrier.id) || []) : [];
                    const agentsImputes = this.getAgentsImputes(taches);
                    const servicesImputes = this.getServicesImputes(taches);
                    const instructionsImputees = this.getInstructionsImputees(taches);

                    worksheetData.push([
                        index + 1,
                        courrier.numeroReception || '-',
                        courrier.numero || '-',
                        this.formatDateFr(courrier.dateReception),
                        this.formatDateFr(courrier.dateCourrier),
                        this.getProvenanceDestination(courrier),
                        courrier.objet || '-',
                        servicesImputes,
                        agentsImputes,
                        instructionsImputees
                    ]);
                }
            });

            const ws = XLSX.utils.aoa_to_sheet(worksheetData);

            ws['!cols'] = sortantSeul
                ? [{wch: 5}, {wch: 20}, {wch: 14}, {wch: 40}, {wch: 60}]
                : [
                    {wch: 5}, {wch: 20}, {wch: 20}, {wch: 12}, {wch: 12},
                    {wch: 35}, {wch: 50}, {wch: 40}, {wch: 40}, {wch: 40}
                ];

            ws['!merges'] = [{s: {r: 0, c: 0}, e: {r: 0, c: lastColIndex}}];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Registre');

            const today = new Date();
            const filename = `registre_courriers_${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}.xlsx`;

            XLSX.writeFile(wb, filename);

            this.messageService.add({
                severity: 'success',
                summary: 'Export réussi',
                detail: 'Le registre a été exporté en Excel avec succès'
            });

        } catch (error) {
            console.error('Erreur export Excel:', error);
            this.messageService.add({
                severity: 'error',
                summary: "Erreur d'export",
                detail: "Une erreur est survenue lors de l'export Excel"
            });
        } finally {
            this.loading = false;
        }
    }


    /**
     * Méthodes utilitaires pour les exports
     */
    private formatDateFr(date: any): string {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR');
    }

    private getProvenanceDestination(courrier: Courrier): string {
        if (courrier.destinateur) {
            return courrier.destinateur.source || '-';
        }
        if (courrier.directionDestinateur) {
            return courrier.directionDestinateur.libelleCourtCdi || '-';
        }
        if (courrier.sourceDirection) {
            return courrier.sourceDirection.source || '-';
        }
        return '-';
    }

    private truncateText(text: string, maxLength: number): string {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    private escapeCsv(text: string): string {
        if (!text) return '';
        // Échapper les guillemets et entourer de guillemets si nécessaire
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return '"' + text.replace(/"/g, '""') + '"';
        }
        return text;
    }

    getStatutLabel(courrier: Courrier): string {
        if (!courrier.isReceptionne) {
            return 'Non réceptionné';
        } else if (courrier.isReceptionne) {
            return 'Réceptionné';
        } else if (courrier.numeroReception) {
            return 'Imputé';
        }
        return 'Inconnu';
    }

    // Méthodes pour les fichiers
    trackByFileId(index: number, pieceJointe: PieceJointe): any {
        return pieceJointe.id || index;
    }

    getFileIcon(typeOrName: string): string {
        if (!typeOrName) return 'pi pi-file';

        const type = typeOrName.toLowerCase();

        if (type.includes('pdf')) return 'pi pi-file-pdf';
        if (type.includes('image') || type.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) return 'pi pi-image';
        if (type.includes('word') || type.match(/\.(doc|docx)$/)) return 'pi pi-file-word';
        if (type.includes('excel') || type.match(/\.(xls|xlsx)$/)) return 'pi pi-file-excel';
        if (type.includes('video') || type.match(/\.(mp4|avi|mov|wmv)$/)) return 'pi pi-video';
        if (type.includes('audio') || type.match(/\.(mp3|wav|ogg)$/)) return 'pi pi-volume-up';
        if (type.match(/\.(zip|rar|7z)$/)) return 'pi pi-file-archive';

        return 'pi pi-file';
    }

    getFileColor(filename: string): string {
        const ext = this.getFileExtension(filename);
        const colorMap: { [key: string]: string } = {
            'pdf': '#ff0000',
            'doc': '#2b579a',
            'docx': '#2b579a',
            'xls': '#1d6f42',
            'xlsx': '#1d6f42',
            'jpg': '#f39c12',
            'jpeg': '#f39c12',
            'png': '#f39c12',
            'gif': '#f39c12'
        };
        return colorMap[ext] || '#607d8b';
    }

    formatFileSize(bytes: number): string {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    getFileName(path: string): string {
        return path ? path.split('/').pop() || path : 'Fichier';
    }

    getFileExtension(filename: string): string {
        return filename.split('.').pop()?.toLowerCase() || '';
    }

    isImage(ext: string): boolean {
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext.toLowerCase());
    }

    isPDF(ext: string): boolean {
        return ext.toLowerCase() === 'pdf';
    }

    isText(ext: string): boolean {
        return ['txt', 'csv', 'log', 'json', 'xml'].includes(ext.toLowerCase());
    }

    getMimeType(ext: string): string {
        const mimeTypes: { [key: string]: string } = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.spreadsheet',
            'txt': 'text/plain'
        };
        return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
    }

    viewFile(pieceJointe: any): void {
        this.currentPieceJointe = pieceJointe;
        this.selectedFileName = pieceJointe.name || this.getFileName(pieceJointe.chemin);
        this.selectedFileType = this.getFileExtension(pieceJointe.chemin || '');

        if (pieceJointe.contenuFichier) {
            const byteCharacters = atob(pieceJointe.contenuFichier);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {
                type: this.getMimeType(this.selectedFileType)
            });

            if (this.isText(this.selectedFileType)) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.fileTextContent = e.target.result;
                };
                reader.readAsText(blob);
            } else {
                this.filePreviewUrl = this.sanitizer.sanitize(
                    SecurityContext.RESOURCE_URL,
                    this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob))
                );
            }

            this.fileViewDialog = true;
        }
    }

    downloadFile(pieceJointe: any): void {
        if (pieceJointe.contenuFichier) {
            const byteCharacters = atob(pieceJointe.contenuFichier);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {
                type: this.getMimeType(this.getFileExtension(pieceJointe.chemin || ''))
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = pieceJointe.name || this.getFileName(pieceJointe.chemin);
            link.click();
            window.URL.revokeObjectURL(url);
        }
    }

    closeFileViewer(): void {
        this.fileViewDialog = false;
        if (this.filePreviewUrl) {
            URL.revokeObjectURL(this.filePreviewUrl);
            this.filePreviewUrl = null;
        }
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    //fonction qui change le libelle(detail) en fonction de ENTRANT(Source)ou SORTANT(destinataire)
    get isEntrant(): boolean {
        return this.courrierSelectionne?.sourceDestination === SourceDestination.ENTRANT;
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }


    getStatutBadge(statut: string): { severity: string, label: string } {
        const statutMap: { [key: string]: { severity: string, label: string } } = {
            'en_cours': {severity: 'info', label: 'En cours'},
            'termine': {severity: 'success', label: 'Terminé'},
            'en_attente': {severity: 'warning', label: 'En attente'},
            'annule': {severity: 'danger', label: 'Annulé'}
        };
        return statutMap[statut] || {severity: 'secondary', label: statut};
    }

// Méthode pour obtenir le badge de priorité
    getPrioriteBadge(priorite: string): { severity: string, label: string } {
        const prioriteMap: { [key: string]: { severity: string, label: string } } = {
            'haute': {severity: 'danger', label: 'Haute'},
            'moyenne': {severity: 'warning', label: 'Moyenne'},
            'basse': {severity: 'info', label: 'Basse'}
        };
        return prioriteMap[priorite] || {severity: 'secondary', label: priorite};
    }

    getTachesEnCours(): Tache[] {
        return this.suiviCourrier.taches.filter(t =>
            t.statut === 'en_cours' || t.statut === 'en_attente'
        );
    }

    getTachesTerminees(): Tache[] {
        return this.suiviCourrier.taches.filter(t => t.statut === 'termine');
    }

    getTachesEnRetard(): Tache[] {
        return this.suiviCourrier.taches.filter(t =>
            this.isEcheanceDepassee(t.dateEcheance) && t.statut !== 'termine'
        );
    }

// Vérifier si l'échéance est dépassée
    isEcheanceDepassee(dateEcheance: string | undefined): boolean {
        if (!dateEcheance) return false;
        return new Date(dateEcheance) < new Date();
    }

// Calculer les jours restants
    getJoursRestants(dateEcheance: string | undefined): number {
        if (!dateEcheance) return 0;
        const now = new Date();
        const echeance = new Date(dateEcheance);
        const diff = echeance.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

// Obtenir l'icône du statut
    getStatutIcon(statut: string | undefined): string {
        const icons: { [key: string]: string } = {
            'en_cours': 'pi pi-spin pi-spinner',
            'termine': 'pi pi-check-circle',
            'en_attente': 'pi pi-clock',
            'annule': 'pi pi-times-circle'
        };
        return icons[statut || ''] || 'pi pi-question-circle';
    }

// Obtenir les détails du statut avec message contextuel
    getStatutDetails(tache: Tache): {
        titre: string,
        message: string,
        icon: string,
        color: string,
        background: string
    } | null {
        const statut = tache.statut || '';
        const isRetard = this.isEcheanceDepassee(tache.dateEcheance) && statut !== 'termine';

        if (statut === 'termine') {
            return {
                titre: '✅ Tâche terminée',
                message: 'Cette tâche a été complétée avec succès.',
                icon: 'pi pi-check-circle',
                color: '#22c55e',
                background: '#f0fdf4'
            };
        } else if (isRetard) {
            const joursRetard = Math.abs(this.getJoursRestants(tache.dateEcheance));
            return {
                titre: '⚠️ Tâche en retard',
                message: `L'échéance a été dépassée de ${joursRetard} jour(s). Action urgente requise.`,
                icon: 'pi pi-exclamation-triangle',
                color: '#ef4444',
                background: '#fef2f2'
            };
        } else if (statut === 'en_cours') {
            const joursRestants = this.getJoursRestants(tache.dateEcheance);
            if (joursRestants <= 2 && joursRestants > 0) {
                return {
                    titre: '⏰ Échéance proche',
                    message: `Attention: il ne reste que ${joursRestants} jour(s) avant l'échéance.`,
                    icon: 'pi pi-clock',
                    color: '#f59e0b',
                    background: '#fffbeb'
                };
            }
            return {
                titre: '🔄 Tâche en cours',
                message: 'Cette tâche est actuellement en traitement.',
                icon: 'pi pi-spin pi-spinner',
                color: '#3b82f6',
                background: '#eff6ff'
            };
        } else if (statut === 'en_attente') {
            return {
                titre: '⏸️ En attente',
                message: 'Cette tâche est en attente de traitement.',
                icon: 'pi pi-pause-circle',
                color: '#6b7280',
                background: '#f9fafb'
            };
        } else if (statut === 'annule') {
            return {
                titre: '❌ Tâche annulée',
                message: 'Cette tâche a été annulée.',
                icon: 'pi pi-times-circle',
                color: '#dc2626',
                background: '#fef2f2'
            };
        }

        return null;
    }

// Style de la card selon le statut
    getCardStyleClass(tache: Tache): string {
        if (tache.statut === 'termine') {
            return 'border-left-3 border-green-500';
        } else if (this.isEcheanceDepassee(tache.dateEcheance) && tache.statut !== 'termine') {
            return 'border-left-3 border-red-500';
        } else if (tache.statut === 'en_cours') {
            return 'border-left-3 border-blue-500';
        }
        return 'border-left-3 border-gray-300';
    }

// Background du header
    getHeaderBackground(tache: Tache): string {
        if (tache.statut === 'termine') {
            return 'linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%)';
        } else if (this.isEcheanceDepassee(tache.dateEcheance) && tache.statut !== 'termine') {
            return 'linear-gradient(90deg, #fef2f2 0%, #fee2e2 100%)';
        } else if (tache.statut === 'en_cours') {
            return 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)';
        }
        return 'linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%)';
    }

// Couleur du marker dans la timeline
    getMarkerColor(tache: Tache): string {
        if (tache.statut === 'termine') {
            return '#22c55e';
        } else if (this.isEcheanceDepassee(tache.dateEcheance) && tache.statut !== 'termine') {
            return '#ef4444';
        } else if (tache.statut === 'en_cours') {
            return '#3b82f6';
        }
        return '#6b7280';
    }

// Statut de l'affectation
    getAffectationStatutSeverity(statut: string | undefined): string {
        const severities: { [key: string]: string } = {
            'active': 'info',
            'en_cours': 'warning',
            'terminee': 'success',
            'inactive': 'secondary'
        };
        return severities[statut || ''] || 'secondary';
    }

    getAffectationStatutLabel(statut: string | undefined): string {
        const labels: { [key: string]: string } = {
            'active': 'Active',
            'en_cours': 'En cours',
            'terminee': 'Terminée',
            'inactive': 'Inactive'
        };
        return labels[statut || ''] || statut || 'Inconnu';
    }

    getAffectationStatutIcon(statut: string | undefined): string {
        const icons: { [key: string]: string } = {
            'active': 'pi pi-user-plus',
            'en_cours': 'pi pi-spin pi-spinner',
            'terminee': 'pi pi-check-circle',
            'inactive': 'pi pi-user-minus'
        };
        return icons[statut || ''] || 'pi pi-question';
    }

    getProgressionLabel(statut: string | undefined): string {
        const labels: { [key: string]: string } = {
            'active': 'À démarrer',
            'en_cours': 'En traitement',
            'terminee': 'Complétée',
            'inactive': 'Désactivée'
        };
        return labels[statut || ''] || 'Inconnu';
    }

    getAgentColor(agentId: number | undefined): string {
        if (!agentId) return '#6c757d'; // Couleur par défaut si pas d'ID

        const colors = [
            '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
            '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
        ];

        return colors[agentId % colors.length];
    }

    // Méthode pour obtenir les initiales (Option 2)
    getInitials(nom: string | undefined, prenom: string | undefined): string {
        const firstInitial = nom ? nom.charAt(0).toUpperCase() : '';
        const lastInitial = prenom ? prenom.charAt(0).toUpperCase() : '';
        return firstInitial + lastInitial || 'UN'; // 'UN' pour utilisateur non identifié
    }

    // Alternative avec hash pour plus de variété de couleurs
    getAgentColorHash(agentId: number | undefined): string {
        if (!agentId) return '#6c757d';

        // Génère une couleur basée sur l'ID
        const hash = agentId.toString();
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = parseInt(hash.charAt(i % hash.length)) * 30 + 100;
            color += Math.min(255, value).toString(16).padStart(2, '0');
        }
        return color;
    }

    /**
     * Charge les tâches de tous les courriers imputés de la liste,
     * nécessaires pour récupérer les agents affectés (comme dans le dialog de détails).
     */
    private async chargerTachesPourExport(): Promise<Map<number, Tache[]>> {
        const result = new Map<number, Tache[]>();

        const courrierIds = this.courriersRegistre
            .filter(c => c.isImputer && c.id)
            .map(c => c.id as number);

        // Traitement STRICTEMENT séquentiel : un seul courrier à la fois.
        // Élimine le risque qu'une réponse pour un autre courrier ne fasse
        // changer la référence du sélecteur pendant qu'on attend celle-ci.
        for (const id of courrierIds) {
            const taches = await this.chargerTachesUnCourrier(id);
            result.set(id, taches);
        }

        return result;
    }

    private async chargerTachesUnCourrier(id: number): Promise<Tache[]> {
        const selector$ = this.store.pipe(select(tacheSelector.selectTachesByCourrierId(id)));

        const valeurAvant = await firstValueFrom(selector$.pipe(take(1)));

        this.store.dispatch(tacheAction.loadTachesByCourrierId({courrierId: id}));

        try {
            const taches = await firstValueFrom(
                selector$.pipe(
                    filter(t => t !== valeurAvant),
                    debounceTime(150), // laisse le store "se stabiliser" avant de lire
                    take(1),
                    timeout(15000)
                )
            );
            return taches || [];
        } catch {
            console.warn(`Timeout lors du chargement des tâches du courrier ${id}`);
            return [];
        }
    }

    /**
     * Liste des agents (Nom Prénom) affectés sur les tâches d'un courrier.
     */
    private getAgentsImputes(taches: Tache[]): string {
        if (!taches || taches.length === 0) return '-';

        const agents = new Set<string>();
        taches.forEach(t => {
            (t.affectations || []).forEach(a => {
                const nomComplet = `${a.agentAssigneNom || ''} ${a.agentAssignePrenom || ''}`.trim();
                if (nomComplet) {
                    agents.add(nomComplet);
                }
            });
        });

        return agents.size ? Array.from(agents).join(' | ') : '-';
    }

    /**
     * Liste des services des agents affectés sur les tâches d'un courrier.
     */
    private getServicesImputes(taches: Tache[]): string {
        if (!taches || taches.length === 0) return '-';

        const services = new Set<string>();
        taches.forEach(t => {
            (t.affectations || []).forEach(a => {
                const service = a.agentAssigneServiceLibelleCourtService;
                if (service) {
                    services.add(service);
                }
            });
        });

        return services.size ? Array.from(services).join(' | ') : '-';
    }

    /**
     * Liste des libellés d'instructions rattachées aux tâches d'un courrier.
     */
    /**
     * Liste des libellés d'instructions rattachées aux tâches d'un courrier.
     */
    private getInstructionsImputees(taches: Tache[]): string {
        if (!taches || taches.length === 0) return '-';

        const instructions = new Set<string>();
        taches.forEach(t => {
            (t.instructions || []).forEach(instr => {
                const libelle = instr.libelleInstruction;
                if (libelle) {
                    instructions.add(libelle);
                }
            });
        });

        return instructions.size ? Array.from(instructions).join(' | ') : '-';
    }

    /**
     * Détermine le mode d'affichage du registre selon la composition de la liste :
     * - 'sortant' : uniquement des courriers sortants
     * - 'entrant' : uniquement des courriers entrants
     * - 'mixte'   : mélange des deux (ou liste vide)
     */
    private getCourrierDisplayMode(): 'entrant' | 'sortant' | 'mixte' {
        if (this.courriersRegistre.length === 0) return 'mixte';

        const hasEntrant = this.courriersRegistre.some(c => c.sourceDestination === SourceDestination.ENTRANT);
        const hasSortant = this.courriersRegistre.some(c => c.sourceDestination === SourceDestination.SORTANT);

        if (hasEntrant && !hasSortant) return 'entrant';
        if (hasSortant && !hasEntrant) return 'sortant';
        return 'mixte';
    }

    /**
     * Libellé de la colonne Provenance/Destination selon le mode.
     */
    private getProvenanceDestinationLabel(mode: 'entrant' | 'sortant' | 'mixte'): string {
        switch (mode) {
            case 'sortant':
                return 'Destination';
            case 'entrant':
                return 'Provenance';
            default:
                return 'Provenance/Destination';
        }
    }

    /**
     * Libellé de la colonne Date Réception selon le mode.
     */
    private getDateReceptionLabel(mode: 'entrant' | 'sortant' | 'mixte'): string {
        switch (mode) {
            case 'sortant':
                return 'Date Expédition';
            case 'entrant':
                return 'Date Réception';
            default:
                return 'Date Réception / Expédition';
        }
    }

}
