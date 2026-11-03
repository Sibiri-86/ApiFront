import { createAction, props } from '@ngrx/store';

export const loadDashboardStats = createAction('[Dashboard] Load Stats');

export const loadDashboardStatsSuccess = createAction(
  '[Dashboard] Load Stats Success',
  props<{
    histogramme: Record<string, number>;
    camembert: Record<string, number>;
  }>()
);

export const loadDashboardStatsFailure = createAction(
  '[Dashboard] Load Stats Failure',
  props<{ error: any }>()
);
