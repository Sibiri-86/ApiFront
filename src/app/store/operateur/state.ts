import { Operateur } from './model';

export interface OperateurState {
  operateurs: Operateur[];
}

export const initialOperateurState: OperateurState = {
  operateurs: []
};
