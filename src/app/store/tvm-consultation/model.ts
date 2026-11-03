export interface QuittanceTvm {
  numQuittance: string;
  operateur: string;
  datePayement: string | null;   // ISO, ex. "2026-10-26T14:30:00"
  montantPaye: number | null;
  noImmat: string;
  identite: string;
  idTransaction: string;
  numContribuable: string;
}

export interface DemandeConsultation {
  token: string;
  dateDebut: string;   // "yyyy-MM-dd"
  dateFin: string;     // "yyyy-MM-dd"
}