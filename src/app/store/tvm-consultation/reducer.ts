import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { QuittanceTvm } from './model';
import { QuittanceTvmActions } from './action';


export interface QuittanceTvmState {
  quittances: QuittanceTvm[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: QuittanceTvmState = {
  quittances: [],
  loading: false,
  loaded: false,
  error: null,
};

export const quittanceTvmFeature = createFeature({
  name: 'quittanceTvm',
  reducer: createReducer(
    initialState,
    on(QuittanceTvmActions.load, (s) => ({ ...s, loading: true, error: null })),
    on(QuittanceTvmActions.loadSuccess, (s, { quittances }) => ({
      ...s, quittances, loading: false, loaded: true,
    })),
    on(QuittanceTvmActions.loadFailure, (s, { error }) => ({
      ...s, loading: false, error, quittances: [],
    })),
    on(QuittanceTvmActions.reset, () => initialState),
  ),
  extraSelectors: ({ selectQuittances }) => ({
    selectTotalMontant: createSelector(selectQuittances, (list) =>
      list.reduce((sum, q) => sum + (q.montantPaye ?? 0), 0)),
    selectNombre: createSelector(selectQuittances, (list) => list.length),
  }),
});