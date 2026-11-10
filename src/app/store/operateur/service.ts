import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GlobalConfig } from 'src/app/config/global.config';
import { Endpoints } from 'src/app/config/module.endpoints';
import { Operateur } from './model';
import { AuthServerProvider } from 'src/app/service-util/auth/auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class OperateurService {
     private auth = inject(AuthServerProvider);
  constructor(private http: HttpClient) {}

  getAll(): Observable<Operateur[]> {
    return this.http.get<Operateur[]>(`${GlobalConfig.getEndpoint(Endpoints.OPERATEUR)}`).pipe(
      catchError(this.handleError())
    );
  }

  create(operateur: Operateur): Observable<Operateur> {
    return this.http.post<Operateur>(`${GlobalConfig.getEndpoint(Endpoints.OPERATEUR)}`, operateur).pipe(
      catchError(this.handleError())
    );
  }

  update(id: number, operateur: Operateur): Observable<Operateur> {
    return this.http.put<Operateur>(`${GlobalConfig.getEndpoint(Endpoints.OPERATEUR)}/${id}`, operateur).pipe(
      catchError(this.handleError())
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${GlobalConfig.getEndpoint(Endpoints.OPERATEUR)}/${id}`).pipe(
      catchError(this.handleError())
    );
  }

    getOperateurConnecte(): Observable<Operateur> {

    return this.http.get<Operateur>(`${GlobalConfig.getEndpoint(Endpoints.OPERATEUR)}/connecte/${this.auth.getAccessToken()}`).pipe(
      catchError(this.handleError())
    );
  }

  private handleError<T>() {
    return (error: HttpErrorResponse) => {
      return throwError(() => error.message || 'Erreur lors de la requête opérateur');
    };
  }
}
