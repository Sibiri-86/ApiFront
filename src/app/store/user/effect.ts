import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "./service";
import { GlobalConfig } from "src/app/config/global.config";
import { StatusEnum } from "../global-config/model";
import { catchError, mergeMap, of, switchMap } from "rxjs";
import * as featureActions from './action';
import { User } from "./model";

@Injectable()
export class UserEffects {


    private successMsg = 'Opération reussie !';
    constructor(
        private actions$: Actions,
        private userService: UserService
    ) {}

    createUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.createUser),
            mergeMap((user: User) =>
                this.userService.createUser(user).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadUser()
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                ))
            ));
    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.updateUser),
            mergeMap((user: User) =>
                this.userService.updateUser(user).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadUser()
                        
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                    
                ))
            ));
    loadUser$ = createEffect(() =>
        this.actions$.pipe(
        ofType(featureActions.loadUser),
        mergeMap(() =>
            this.userService.$getUsers().pipe(
                switchMap(users => [
                  //  GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                    featureActions.setUser({users})
                                
                ]),
            catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error.error)))
            
        ))
                    
    ));

    activerDesactiver$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.activerDesactiver),
            mergeMap((user: User) =>
                this.userService.activeOrdesactive(user).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadUser()
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                ))
            ));

     reunitialise$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.reunitialiser),
            mergeMap(({email, newPassword}) =>
                this.userService.reunitialiser(email,newPassword).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadUser()
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                ))
            ));
}