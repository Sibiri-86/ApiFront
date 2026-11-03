import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { InfosQuittance } from './model';
import { QuittanceActions } from './action';

export interface QuittanceState {
  quittances: InfosQuittance[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: QuittanceState = {
  quittances: [],
  loading: false,
  loaded: false,
  error: null,
};

export const quittanceFeature = createFeature({
  name: 'quittanceImpot',
  reducer: createReducer(
    initialState,
    on(QuittanceActions.load, (s) => ({ ...s, loading: true, loaded: false, error: null, quittances: [] })),
    on(QuittanceActions.loadSuccess, (s, { quittances }) => ({ ...s, loading: false, loaded: true, quittances })),
    on(QuittanceActions.loadFailure, (s, { error }) => ({ ...s, loading: false, loaded: true, error })),
    on(QuittanceActions.reset, () => initialState)
  ),
  extraSelectors: ({ selectQuittances }) => ({
    selectTotalMontant: createSelector(selectQuittances, (q) =>
      q.reduce((somme, x) => somme + (x.montantImpot ?? 0), 0)
    ),
    selectNombre: createSelector(selectQuittances, (q) => q.length),
  }),
});