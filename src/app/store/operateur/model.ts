export interface Operateur {
  id?: number;
  codeOperateur?: string;
  libelleOperateur?: string;
  apiTr?: boolean;
  apiTvm?: boolean;
  apiImpot?: boolean;
  apiOds?: boolean;
  apiIfu?: boolean;
  secretTr?: string;
  secretTvm?: string;
  secretImpot?: string;
  secretOds?: string;
  secretIfu?: string;
  deleted?: boolean;
}
