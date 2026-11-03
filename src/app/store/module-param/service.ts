import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ModuleParam } from "./model";
import { catchError, map, Observable, throwError } from "rxjs";
import { GlobalConfig } from "src/app/config/global.config";
import { Endpoints } from "src/app/config/module.endpoints";


@Injectable({providedIn: 'root'})
export class ModuleParamService {
constructor(private http: HttpClient) {}

$getModuleParams(): Observable<ModuleParam[]> {
  
    // @FIXME: get request
    return this.http.get<ModuleParam[]>( `${GlobalConfig.getEndpoint(Endpoints.MODULE)}`).pipe(
      catchError(this.handleError())
    );
}

createModuleParam(moduleParam: ModuleParam): Observable<any> {
  console.log("===================oui==========",moduleParam);
    // @FIXME: post request
    return this.http.post(`${GlobalConfig.getEndpoint(Endpoints.MODULE)}`, moduleParam);
  }

updateModuleParam(moduleParam: ModuleParam): Observable<any> {
    // @FIXME: post request
    return this.http.put(`${GlobalConfig.getEndpoint(Endpoints.MODULE)}/${moduleParam.id}`, moduleParam);
}
deleteModuleParam(moduleParam: ModuleParam): Observable<any> {
    // @FIXME: post request
    return this.http.patch(`${GlobalConfig.getEndpoint(Endpoints.MODULE)}/${moduleParam.id}`, moduleParam);
}


private handleError<T>() {
    return (error: HttpErrorResponse) => {
        return throwError(() => error.message || 'Something went wrong');
    };
  }

}
