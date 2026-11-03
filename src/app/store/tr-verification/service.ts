import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeVerification, ReponseVerification } from './model';

// ⚠️ Adapte au chemin réel de ton contrôleur (ex: '/tvm/verification')
const VERIFICATION_URL = '/tr';

@Injectable({ providedIn: 'root' })
export class TrService {
  constructor(private http: HttpClient) {}

  verifier(demande: DemandeVerification): Observable<ReponseVerification> {
    return this.http.post<ReponseVerification>(VERIFICATION_URL+'/verification', demande);
  }
}