export interface DemandeVerificationTvm {
  ID_TRANSACTION: string;
  JETON: string;
}

export interface Entete {
  CODEERREUR: number;
  MESSAGE: string;
}

// ⚠️ Adapte les noms de propriétés JSON à ceux de ton ReponseVerificationTvm côté Spring
export interface ReponseVerificationTvm {
  NO_SERIE?: string;
  NO_IMMAT?: string;
  MARQUE?: string;
  MODEL?: string;
  MONTANT_PAYE?: number;
  DATE_PAYEMENT?: string;
  ID_TRANSACTION?: string;
  NUM_QUITTANCE?: string;
  NUMERO_CONTRIBUABLE?: string;
  OPERATEUR?: string;
  ANNEE_GESTION?: string;
}

export interface ReponseApi<T> {
  ENTETE: Entete;
  RESULTAT?: T;
}