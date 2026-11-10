import { Operateur } from './model';

export interface OperateurState {
  operateurs: Operateur[];
  operateur?: Operateur;
}

export const initialOperateurState: OperateurState = {
  operateurs: [],
  operateur: undefined
};
