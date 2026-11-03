import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "./model";
import { catchError, map, Observable, throwError } from "rxjs";
import { GlobalConfig } from "src/app/config/global.config";
import { Endpoints } from "src/app/config/module.endpoints";
import { co } from "@fullcalendar/core/internal-common";


@Injectable({providedIn: 'root'})
export class UserService {
constructor(private http: HttpClient) {}

$getUsers(): Observable<User[]> {
  
    // @FIXME: get request
    return this.http.get<User[]>( `${GlobalConfig.getEndpoint(Endpoints.USER)}`).pipe(
      catchError(this.handleError())
    );
}

createUser(user: User): Observable<any> {
    console.log('service user:', user);
    // @FIXME: post request
    return this.http.post(`${GlobalConfig.getEndpoint(Endpoints.USER)}`, user);
  }

updateUser(user: User): Observable<any> {
    // @FIXME: post request
    return this.http.put(`${GlobalConfig.getEndpoint(Endpoints.USER)}/${user.id}`, user);
}

activeOrdesactive(user: User): Observable<any> {
    // @FIXME: post request
    return this.http.put(`${GlobalConfig.getEndpoint(Endpoints.USER)}/active-desactive-user/${user.id}`, user);
}

reunitialiser(email: string, newPassword: string): Observable<any> {
    console.log('service email:', email);
    console.log('service newPassword:', newPassword);
    // @FIXME: post request
    return this.http.post(`${GlobalConfig.getEndpoint(Endpoints.USER)}/account/reunitialiser`, {email, newPassword});
}
deleteAdherent(user: User): Observable<any> {
    // @FIXME: post request
    return this.http.patch(`${GlobalConfig.getEndpoint(Endpoints.USER)}/${user.id}`, user);
}




private handleError<T>() {
    return (error: HttpErrorResponse) => {
        return throwError(() => error.message || 'Something went wrong');
    };
  }

}
