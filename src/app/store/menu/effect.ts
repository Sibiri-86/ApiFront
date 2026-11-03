import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { MenuActionService } from "./service";
import { GlobalConfig } from "src/app/config/global.config";
import { StatusEnum } from "../global-config/model";
import { catchError, mergeMap, of, switchMap } from "rxjs";
import * as featureActions from './action';
import { MenuAction } from "./model";

@Injectable()
export class MenuActionEffects {


    private successMsg = 'Opération reussie !';
    constructor(
        private actions$: Actions,
        private menuActionService: MenuActionService
    ) {}

    createMenuAction$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.createMenuAction),
            mergeMap((menuAction: MenuAction) =>
                this.menuActionService.createMenuAction(menuAction).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadMenuAction()
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                ))
            ));
    updateMenuAction$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.updateMenuAction),
            mergeMap((menuAction: MenuAction) =>
                this.menuActionService.updateMenuAction(menuAction).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadMenuAction()
                        
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                    
                ))
            ));
    loadMenuAction$ = createEffect(() =>
        this.actions$.pipe(
        ofType(featureActions.loadMenuAction),
        mergeMap(() =>
            this.menuActionService.$getMenuActions().pipe(
                switchMap(menuActions => [
                 //   GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                    featureActions.setMenuAction({menuActions})
                                
                ]),
            catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
            
        ))
                    
    ));


 deleteMenuAction$ = createEffect(() =>
    this.actions$.pipe(
            ofType(featureActions.deleteMenuAction),
            mergeMap((menuAction: MenuAction) =>
                this.menuActionService.deleteMenuAction(menuAction).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadMenuAction()
                        
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                    
                ))
            )); 
}