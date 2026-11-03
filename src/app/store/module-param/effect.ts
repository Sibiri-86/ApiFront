import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ModuleParamService } from "./service";
import { GlobalConfig } from "src/app/config/global.config";
import { StatusEnum } from "../global-config/model";
import { catchError, mergeMap, of, switchMap } from "rxjs";
import * as featureActions from './action';
import { ModuleParam } from "./model";

@Injectable()
export class ModuleParamEffects {


    private successMsg = 'Opération reussie !';
    constructor(
        private actions$: Actions,
        private moduleParamService: ModuleParamService
    ) {}

    createModuleParam$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.createModuleParam),
            mergeMap((moduleParam: ModuleParam) =>
                this.moduleParamService.createModuleParam(moduleParam).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadModuleParam()
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                ))
            ));
    updateModuleParam$ = createEffect(() =>
        this.actions$.pipe(
            ofType(featureActions.updateModuleParam),
            mergeMap((moduleParam: ModuleParam) =>
                this.moduleParamService.updateModuleParam(moduleParam).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadModuleParam()
                        
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                    
                ))
            ));
    loadModuleParam$ = createEffect(() =>
        this.actions$.pipe(
        ofType(featureActions.loadModuleParam),
        mergeMap(() =>
            this.moduleParamService.$getModuleParams().pipe(
                switchMap(moduleParams => [
                  //  GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                    featureActions.setModuleParam({moduleParams})
                                
                ]),
            catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
            
        ))
                    
    ));


 deleteModuleParam$ = createEffect(() =>
    this.actions$.pipe(
            ofType(featureActions.deleteModuleParam),
            mergeMap((moduleParam: ModuleParam) =>
                this.moduleParamService.deleteModuleParam(moduleParam).pipe(
                    switchMap(value => [
                        GlobalConfig.setStatus(StatusEnum.success, this.successMsg),
                        featureActions.loadModuleParam()
                        
                    ]),
                    catchError(error => of(GlobalConfig.setStatus(StatusEnum.error, error)))
                    
                ))
            )); 
}