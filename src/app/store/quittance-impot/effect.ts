import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { QuittanceImpotService } from './service';
import { QuittanceActions } from './action';

@Injectable()
export class QuittanceImpotEffects {
  private actions$ = inject(Actions);
  private service = inject(QuittanceImpotService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuittanceActions.load),
      switchMap(({ dateDebut, dateFin }) =>
        this.service.consulter({ dateDebut, dateFin }).pipe(
          map((quittances) => QuittanceActions.loadSuccess({ quittances })),
          catchError((err: HttpErrorResponse) =>
            of(
              QuittanceActions.loadFailure({
                error:
                  err.error?.message ??
                  'Le service est indisponible. Réessayez dans un instant.',
              })
            )
          )
        )
      )
    )
  );
}