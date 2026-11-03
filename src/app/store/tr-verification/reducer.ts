import { createFeature, createReducer, on } from '@ngrx/store';
import { ResultatVerification } from './model';
import { TrActions } from './action';

export interface TrState {
  loading: boolean;
  resultat: ResultatVerification | null;
  message: string | null;
  erreur: { code: number; message: string } | null;
}

export const initialState: TrState = {
  loading: false,
  resultat: null,
  message: null,
  erreur: null,
};

export const trFeature = createFeature({
  name: 'tr',
  reducer: createReducer(
    initialState,
    on(TrActions.verifier, (state) => ({
      ...state,
      loading: true,
      resultat: null,
      message: null,
      erreur: null,
    })),
    on(TrActions.verifierSucces, (state, { message, resultat }) => ({
      ...state,
      loading: false,
      resultat,
      message,
    })),
    on(TrActions.verifierEchec, (state, { code, message }) => ({
      ...state,
      loading: false,
      erreur: { code, message },
    })),
    on(TrActions.reinitialiser, () => initialState)
  ),
});

export const {
  selectLoading,
  selectResultat,
  selectMessage,
  selectErreur,
} = trFeature;