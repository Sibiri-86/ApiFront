import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Direction } from '../components/model/direction';
import { API_URL } from '../components/model/util.model';




type EntityResponseType = HttpResponse<Direction>;
type EntityArrayResponseType = HttpResponse<Direction[]>;

@Injectable({ providedIn: 'root' })
export class DirectionService {
    public resourceUrl = API_URL + '/directions';

    constructor(protected http: HttpClient) {}

   /*  create(direction: Direction): Observable<EntityResponseType> {
        return this.http.post<Direction>(this.resourceUrl, direction, { observe: 'response' });
    } */

    update(direction: Direction): Observable<EntityResponseType> {
        return this.http.put<Direction>(`${this.resourceUrl}/${direction.id}`, direction, { observe: 'response' });
    }

    deleteAll(directions: Direction[]): Observable<EntityArrayResponseType> {
        return this.http.put<Direction[]>(`${this.resourceUrl}/all`, directions, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Direction>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        return this.http.get<Direction[]>(this.resourceUrl, {  observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>>{
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }




}
