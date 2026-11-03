import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ProfilService } from "./service";
import { GlobalConfig } from "src/app/config/global.config";
import { StatusEnum } from "../global-config/model";
import { catchError, mergeMap, of, switchMap } from "rxjs";
import * as featureActions from './action';
import { Profil } from "./model";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class ProfilEffects {


    private successMsg = 'Opération reussie !';
    constructor(
        private actions$: Actions,
        private profilService: ProfilService
    ) {}

    createProfil$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.createProfil),
            mergeMap((profil: Profil) =>
                this.profilService.createProfil(profil).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadProfil()
                    ]),
                    catchError((error: HttpErrorResponse) => {
                       return of(GlobalConfig.setStatus(StatusEnum.error, error.error.error)
                    )})                ))
            ));

    updateProfil$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.updateProfil),
            mergeMap((profil: Profil) =>
                this.profilService.updateProfil(profil).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadProfil()

                    ]),
                    catchError((error: HttpErrorResponse) => {
                       return of(GlobalConfig.setStatus(StatusEnum.error, error.error.error)
                    )})

                ))
            ));

    loadProfil$ = createEffect(() =>
        this.actions$.pipe(
        ofType(featureActions.loadProfil),
        mergeMap(() =>
            this.profilService.$getProfils().pipe(
                switchMap(profils => [
                   // GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                    featureActions.setProfil({profils})

                ]),
                catchError((error: HttpErrorResponse) => {
                   return of(GlobalConfig.setStatus(StatusEnum.error, error.error.error)
                )})
        ))

    ));

 deleteProfil$ = createEffect(() =>
    this.actions$.pipe(
            ofType(featureActions.deleteProfil),
            mergeMap((profil: Profil) =>
                this.profilService.deleteProfil(profil).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadProfil()

                    ]),
                    catchError((error: HttpErrorResponse) => {
                        console.log( error);
                       return of(GlobalConfig.setStatus(StatusEnum.error, error.error.error)
                    )})
                ))
            ));
}
