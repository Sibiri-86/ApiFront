import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeConsultation, QuittanceTvm } from './model';
import { AuthServerProvider } from 'src/app/service-util/auth/auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class QuittanceTvmService {
  private http = inject(HttpClient);
  private auth = inject(AuthServerProvider);
  private readonly url = '/quittance/quittance-tvm'; 

  consulter(dateDebut: string, dateFin: string): Observable<QuittanceTvm[]> {
    const body: DemandeConsultation = {
      token: this.auth.getAccessToken() ?? '',  
      dateDebut,
      dateFin,
    };
    return this.http.put<QuittanceTvm[]>(this.url, body);
  }
}