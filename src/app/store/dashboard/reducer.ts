import { createReducer, on, Action } from '@ngrx/store';
import { DashboardState, initialDashboardState } from './state';
import * as DashboardActions from './action';

const reducer = createReducer(
  initialDashboardState,
  on(DashboardActions.loadDashboardStatsSuccess, (state, { histogramme, camembert }) => ({
    ...state,
    histogramme,
    camembert,
    error: null
  })),
  on(DashboardActions.loadDashboardStatsFailure, (state, { error }) => ({
    ...state,
    error
  }))
);

export function dashboardReducer(state: DashboardState | undefined, action: Action): DashboardState {
  return reducer(state, action);
}
