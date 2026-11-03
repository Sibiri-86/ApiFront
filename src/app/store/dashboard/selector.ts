import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './state';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectHistogramme = createSelector(
  selectDashboardState,
  state => state.histogramme
);

export const selectCamembert = createSelector(
  selectDashboardState,
  state => state.camembert
);

export const selectDashboardError = createSelector(
  selectDashboardState,
  state => state.error
);
