import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { GlobalConfig } from 'src/app/config/global.config';
import { Endpoints } from 'src/app/config/module.endpoints';
import { HistogrammeTacheDto, CamembertTacheDto } from './model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getHistogrammeTaches(): Observable<Record<string, number>> {
    return this.http.get<HistogrammeTacheDto>(
      `${GlobalConfig.getEndpoint(Endpoints.DASHBOARD_HISTOGRAMME)}`
    ).pipe(
      map(dto => dto.tachesTermineesParMois),
      catchError(this.handleError())
    );
  }

  getCamembertTaches(): Observable<Record<string, number>> {
    return this.http.get<CamembertTacheDto>(
      `${GlobalConfig.getEndpoint(Endpoints.DASHBOARD_CAMEMBERT)}`
    ).pipe(
      map(dto => dto.tachesParStatut),
      catchError(this.handleError())
    );
  }

  private handleError<T>() {
    return (error: HttpErrorResponse) => {
      return throwError(() => error.message || 'Erreur lors du chargement du dashboard');
    };
  }
}
