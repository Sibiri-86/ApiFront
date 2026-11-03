import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profil } from '../components/model/profil';
import { API_URL } from '../components/model/util.model';




type EntityResponseType = HttpResponse<Profil>;
type EntityArrayResponseType = HttpResponse<Profil[]>;

@Injectable({ providedIn: 'root' })
export class ProfilService {
    public resourceUrl = API_URL + '/profils';

    constructor(protected http: HttpClient) {}

    create(profil: Profil): Observable<EntityResponseType> {
        return this.http.post<Profil>(this.resourceUrl, profil, { observe: 'response' });
    }

    update(profil: Profil): Observable<EntityResponseType> {
        return this.http.put<Profil>(`${this.resourceUrl}/${profil.id}`, profil, { observe: 'response' });
    }

    deleteAll(profils: Profil[]): Observable<EntityArrayResponseType> {
        return this.http.put<Profil[]>(`${this.resourceUrl}/all`, profils, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Profil>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        return this.http.get<Profil[]>(this.resourceUrl, {  observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>>{
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

   
    
   
}
