export interface QuittanceTr {
  numeroQuittance: string;
  vcodeContribuable: string;          // voir remarque sur Jackson
  nom: string;
  prenom: string;
  montantTaxeResidence: number | null;
  anneeGestion: number | null;
  datePaiement: string | null;        // "26/10/2026"
  montantPaye: number | null;
  idTransaction: string;
  operateur: string;
  telephone: string;
  dateInsert: string | null;
}

export interface DemandeConsultationTr {
  token: string;
  dateDebut: string;   // "yyyy-MM-dd"
  dateFin: string;     // "yyyy-MM-dd"
}