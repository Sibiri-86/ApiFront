import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeVerificationTvm, ReponseApi, ReponseVerificationTvm } from './model';

// ⚠️ Adapte au chemin réel de ton contrôleur (ex: '/tvm/verification')
const VERIFICATION_URL = '/tvm2';

@Injectable({ providedIn: 'root' })
export class TvmService {
  constructor(private http: HttpClient) {}

  verifier(demande: DemandeVerificationTvm): Observable<ReponseApi<ReponseVerificationTvm>> {
    return this.http.post<ReponseApi<ReponseVerificationTvm>>(VERIFICATION_URL+'/verification', demande);
  }
}