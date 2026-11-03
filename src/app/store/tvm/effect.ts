import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TvmService } from './service';
import { TvmActions } from './action';

@Injectable()
export class TvmEffects {
  verifier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TvmActions.verifier),
      switchMap(({ demande }) =>
        this.tvmService.verifier(demande).pipe(
          map((reponse) => {
            const code = reponse.ENTETE?.CODEERREUR;
            const message = reponse.ENTETE?.MESSAGE ?? '';
            // Les erreurs métier (404, 406...) peuvent arriver avec un HTTP 200
            if (code === 200 && reponse.RESULTAT) {
              return TvmActions.verifierSucces({ message, resultat: reponse.RESULTAT });
            }
            return TvmActions.verifierEchec({ code, message: message || 'Réponse inattendue du serveur' });
          }),
          catchError((err: HttpErrorResponse) => {
            // TvmException (ex: 403) ou autre erreur HTTP
            const entete = err.error?.ENTETE;
            return of(
              TvmActions.verifierEchec({
                code: entete?.CODEERREUR ?? err.status,
                message:
                  entete?.MESSAGE ??
                  err.error?.message ??
                  'Le service est indisponible. Réessayez dans un instant.',
              })
            );
          })
        )
      )
    )
  );

  constructor(private actions$: Actions, private tvmService: TvmService) {}
}