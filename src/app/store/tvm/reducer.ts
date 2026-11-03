import { createFeature, createReducer, on } from '@ngrx/store';
import { ReponseVerificationTvm } from './model';
import { TvmActions } from './action';

export interface TvmState {
  loading: boolean;
  resultat: ReponseVerificationTvm | null;
  message: string | null;
  erreur: { code: number; message: string } | null;
}

export const initialState: TvmState = {
  loading: false,
  resultat: null,
  message: null,
  erreur: null,
};

export const tvmFeature = createFeature({
  name: 'tvm',
  reducer: createReducer(
    initialState,
    on(TvmActions.verifier, (state) => ({
      ...state,
      loading: true,
      resultat: null,
      message: null,
      erreur: null,
    })),
    on(TvmActions.verifierSucces, (state, { message, resultat }) => ({
      ...state,
      loading: false,
      resultat,
      message,
    })),
    on(TvmActions.verifierEchec, (state, { code, message }) => ({
      ...state,
      loading: false,
      erreur: { code, message },
    })),
    on(TvmActions.reinitialiser, () => initialState)
  ),
});

export const {
  selectLoading,
  selectResultat,
  selectMessage,
  selectErreur,
} = tvmFeature;