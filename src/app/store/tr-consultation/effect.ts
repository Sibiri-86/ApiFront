import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { QuittanceTrActions } from './action';
import { QuittanceTrService } from './service';

@Injectable()
export class QuittanceTrEffects {
  private actions$ = inject(Actions);
  private service = inject(QuittanceTrService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuittanceTrActions.load),
      switchMap(({ dateDebut, dateFin }) =>
        this.service.consulter(dateDebut, dateFin).pipe(
          map((quittances) => QuittanceTrActions.loadSuccess({ quittances })),
          catchError((err) =>
            of(QuittanceTrActions.loadFailure({
              error: err?.error?.message ?? 'Erreur lors du chargement des quittances TR.',
            }))),
        )),
    ));
}