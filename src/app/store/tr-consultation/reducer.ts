import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { QuittanceTr } from './model';
import { QuittanceTrActions } from './action';

export interface QuittanceTrState {
  quittances: QuittanceTr[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: QuittanceTrState = {
  quittances: [],
  loading: false,
  loaded: false,
  error: null,
};

export const quittanceTrFeature = createFeature({
  name: 'quittanceTr',
  reducer: createReducer(
    initialState,
    on(QuittanceTrActions.load, (s) => ({ ...s, loading: true, error: null })),
    on(QuittanceTrActions.loadSuccess, (s, { quittances }) => ({
      ...s, quittances, loading: false, loaded: true,
    })),
    on(QuittanceTrActions.loadFailure, (s, { error }) => ({
      ...s, loading: false, error, quittances: [],
    })),
    on(QuittanceTrActions.reset, () => initialState),
  ),
  extraSelectors: ({ selectQuittances }) => ({
    selectTotalMontant: createSelector(selectQuittances, (list) =>
      list.reduce((sum, q) => sum + (q.montantPaye ?? 0), 0)),
    selectTotalTaxe: createSelector(selectQuittances, (list) =>
      list.reduce((sum, q) => sum + (q.montantTaxeResidence ?? 0), 0)),
    selectNombre: createSelector(selectQuittances, (list) => list.length),
  }),
});