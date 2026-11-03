export interface DemandeConsultation {
  dateDebut: string; // yyyy-MM-dd
  dateFin: string;
  token?: string;
}

export interface InfosQuittance {
  numQuittance: string;
  dateQuittance: string;
  montantImpot: number;
  nom: string;
  enCommercial: string;
  operateur: string;
  natImpot: string;
  impot: string;
  ifu: string;
  structure: string;
}