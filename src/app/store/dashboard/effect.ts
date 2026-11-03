import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from './service';
import * as DashboardActions from './action';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable()
export class DashboardEffects {
  constructor(private actions$: Actions, private dashboardService: DashboardService) {}

  loadDashboardStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboardStats),
      switchMap(() =>
        forkJoin({
          histogramme: this.dashboardService.getHistogrammeTaches(),
          camembert: this.dashboardService.getCamembertTaches()
        }).pipe(
          map(({ histogramme, camembert }) =>
            DashboardActions.loadDashboardStatsSuccess({ histogramme, camembert })
          ),
          catchError(error => of(DashboardActions.loadDashboardStatsFailure({ error })))
        )
      )
    )
  );
}
