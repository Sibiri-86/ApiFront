export interface DemandeVerification {
  VIDTRANSACTION: string;
  JETON: string;
}

export interface EnteteReponse {
  CODEERREUR: number;
  MESSAGE: string;
}

export interface ResultatVerification {
  IDTRANSACTION?: string;
  CODECONTRIBUABLE?: string;
  DATEPAYEMENT?: string;
  QUITTANCE?: string;
  MONT_PRELEVE?: number;
  OPERATEUR?: string;
  NUMERO_CONTRIBUABLE?: string;
  NOM?: string;
  PRENOM?: string;
}

export interface ReponseVerification {
  ENTETE: EnteteReponse;
  RESULTAT?: ResultatVerification;
}
