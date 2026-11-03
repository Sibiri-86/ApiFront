import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TrService } from './service';
import { TrActions } from './action';

@Injectable()
export class TrEffects {
  verifier$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrActions.verifier),
      switchMap(({ demande }) =>
        this.trService.verifier(demande).pipe(
          map((reponse) => {
            const code = reponse.ENTETE?.CODEERREUR;
            const message = reponse.ENTETE?.MESSAGE ?? '';
            // Les erreurs métier (404, 406...) peuvent arriver avec un HTTP 200
            if (code === 200 && reponse.RESULTAT) {
              return TrActions.verifierSucces({ message, resultat: reponse.RESULTAT });
            }
            return TrActions.verifierEchec({ code, message: message || 'Réponse inattendue du serveur' });
          }),
          catchError((err: HttpErrorResponse) => {
            // TrException (ex: 403) ou autre erreur HTTP
            const entete = err.error?.ENTETE;
            return of(
              TrActions.verifierEchec({
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

  constructor(private actions$: Actions, private trService: TrService) {}
}