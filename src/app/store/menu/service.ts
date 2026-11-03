import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MenuAction } from "./model";
import { catchError, map, Observable, throwError } from "rxjs";
import { GlobalConfig } from "src/app/config/global.config";
import { Endpoints } from "src/app/config/module.endpoints";


@Injectable({providedIn: 'root'})
export class MenuActionService {
constructor(private http: HttpClient) {}

$getMenuActions(): Observable<MenuAction[]> {
  
    // @FIXME: get request
    return this.http.get<MenuAction[]>( `${GlobalConfig.getEndpoint(Endpoints.MENU)}`).pipe(
      catchError(this.handleError())
    );
}

createMenuAction(menuAction: MenuAction): Observable<any> {
  console.log("===================oui=========="+menuAction)
    // @FIXME: post request
    return this.http.post(`${GlobalConfig.getEndpoint(Endpoints.MENU)}`, menuAction);
  }

updateMenuAction(menuAction: MenuAction): Observable<any> {
    // @FIXME: post request
    return this.http.put(`${GlobalConfig.getEndpoint(Endpoints.MENU)}${menuAction.id}`, menuAction);
}
deleteMenuAction(menuAction: MenuAction): Observable<any> {
    // @FIXME: post request
    return this.http.patch(`${GlobalConfig.getEndpoint(Endpoints.MENU)}/${menuAction.id}`, menuAction);
}


private handleError<T>() {
    return (error: HttpErrorResponse) => {
        return throwError(() => error.message || 'Something went wrong');
    };
  }

}
