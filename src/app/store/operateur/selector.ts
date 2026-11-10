import { AppState } from '../app.state';

export const operateurList = (state: AppState) => state.operateurState.operateurs;
export const operateurConnecte = (state: AppState) => state.operateurState.operateur;
