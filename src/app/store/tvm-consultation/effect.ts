import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { QuittanceTvmActions } from './action';
import { QuittanceTvmService } from './service';


@Injectable()
export class QuittanceTvmEffects {
  private actions$ = inject(Actions);
  private service = inject(QuittanceTvmService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuittanceTvmActions.load),
      switchMap(({ dateDebut, dateFin }) =>
        this.service.consulter(dateDebut, dateFin).pipe(
          map((quittances) => QuittanceTvmActions.loadSuccess({ quittances })),
          catchError((err) =>
            of(QuittanceTvmActions.loadFailure({
              error: err?.error?.message ?? 'Erreur lors du chargement des quittances.',
            }))),
        )),
    ));
}