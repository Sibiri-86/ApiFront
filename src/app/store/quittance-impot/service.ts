import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeConsultation, InfosQuittance } from './model';
import { AuthServerProvider } from 'src/app/service-util/auth/auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class QuittanceImpotService {
  private http = inject(HttpClient);
  private auth = inject(AuthServerProvider);

  consulter(demande: DemandeConsultation): Observable<InfosQuittance[]> {
    demande.token = this.auth.getAccessToken() ?? ''; // <- même source que pour la TVM
    return this.http.post<InfosQuittance[]>('/quittance/consultation-import-operateur', demande);
  }
}