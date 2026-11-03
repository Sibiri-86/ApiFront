import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Profil, ProfilList } from "./model";
import { catchError, map, Observable, throwError } from "rxjs";
import { GlobalConfig } from "src/app/config/global.config";
import { Endpoints } from "src/app/config/module.endpoints";


@Injectable({providedIn: 'root'})
export class ProfilService {
constructor(private http: HttpClient) {}

$getProfils(): Observable<Profil[]> {

    // @FIXME: get request
    return this.http.get<Profil[]>( `${GlobalConfig.getEndpoint(Endpoints.PROFIL)}`).pipe(
      catchError(this.handleError())
    );
}

createProfil(profil: Profil): Observable<any> {
  console.log("===================oui=========="+profil)
    // @FIXME: post request
    return this.http.post(`${GlobalConfig.getEndpoint(Endpoints.PROFIL)}`, profil);
  }

updateProfil(profil: Profil): Observable<any> {
    // @FIXME: post request
    return this.http.put(`${GlobalConfig.getEndpoint(Endpoints.PROFIL)}${profil.id}`, profil);
}
deleteProfil(profil: Profil): Observable<any> {
    // @FIXME: post request
    return this.http.patch(`${GlobalConfig.getEndpoint(Endpoints.PROFIL)}/${profil.id}`, profil);
}


private handleError<T>() {
    return (error: HttpErrorResponse) => {
        return throwError(() => error.message || 'Something went wrong');
    };
  }

}
