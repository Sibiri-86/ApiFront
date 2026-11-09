import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, of, switchMap } from 'rxjs';
import { GlobalConfig } from 'src/app/config/global.config';
import { StatusEnum } from '../global-config/model';
import * as featureActions from './action';
import { OperateurService } from './service';

@Injectable()
export class OperateurEffects {
  private readonly successMsg = 'Opération réussie !';

  constructor(
    private actions$: Actions,
    private operateurService: OperateurService
  ) {}

  loadOperateur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(featureActions.loadOperateur),
      mergeMap(() =>
        this.operateurService.getAll().pipe(
          switchMap((operateurs) => [
            featureActions.setOperateur({ operateurs })
          ]),
          catchError((error) => of(GlobalConfig.setStatus(StatusEnum.error, error?.message || error)))
        )
      )
    )
  );

  createOperateur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(featureActions.createOperateur),
      mergeMap((operateur) =>
        this.operateurService.create(operateur).pipe(
          switchMap(() => [
            GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
            featureActions.loadOperateur()
          ]),
          catchError((error) => of(GlobalConfig.setStatus(StatusEnum.error, error?.message || error)))
        )
      )
    )
  );

  updateOperateur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(featureActions.updateOperateur),
      mergeMap((operateur) =>
        this.operateurService.update(operateur.id ?? 0, operateur).pipe(
          switchMap(() => [
            GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
            featureActions.loadOperateur()
          ]),
          catchError((error) => of(GlobalConfig.setStatus(StatusEnum.error, error?.message || error)))
        )
      )
    )
  );

  deleteOperateur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(featureActions.deleteOperateur),
      mergeMap(({ id }) =>
        this.operateurService.delete(id).pipe(
          switchMap(() => [
            GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
            featureActions.loadOperateur()
          ]),
          catchError((error) => of(GlobalConfig.setStatus(StatusEnum.error, error?.message || error)))
        )
      )
    )
  );
}
