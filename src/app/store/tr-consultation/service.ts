import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuittanceTr, DemandeConsultationTr } from './model';
import { AuthServerProvider } from 'src/app/service-util/auth/auth-jwt.service';

@Injectable({ providedIn: 'root' })
export class QuittanceTrService {
  private http = inject(HttpClient);
  private readonly url = '/quittance/quittance-tr';   // <- à adapter au préfixe de votre contrôleur

  private auth = inject(AuthServerProvider);
  consulter(dateDebut: string, dateFin: string): Observable<QuittanceTr[]> {
    const body: DemandeConsultationTr = {
      token: this.auth.getAccessToken() ?? '',     // <- même source que pour la TVM
      dateDebut,
      dateFin,
    };
    return this.http.put<QuittanceTr[]>(this.url, body);   // PUT, comme le @PutMapping
  }
}