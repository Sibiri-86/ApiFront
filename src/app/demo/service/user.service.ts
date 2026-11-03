import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../api/user';
import { API_URL } from '../components/model/util.model';




type EntityResponseType = HttpResponse<User>;
type EntityArrayResponseType = HttpResponse<User[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
    public resourceUrl = API_URL + '/users';

    constructor(protected http: HttpClient ) {}

    create(user: User): Observable<EntityResponseType> {
        return this.http.post<User>(`${this.resourceUrl}/`, user, { observe: 'response' });
    }

    update(user: User): Observable<EntityResponseType> {
        return this.http.put<User>(`${this.resourceUrl}/${user.id}`, user, { observe: 'response' });
    }

    deleteAll(users: User[]): Observable<EntityArrayResponseType> {
        return this.http.put<User[]>(`${this.resourceUrl}/all`, users, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<User>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        return this.http.get<User[]>(`${this.resourceUrl}/`, {  observe: 'response' });
    }

    findUserByEmailExist(): Observable<EntityArrayResponseType> {
        return this.http.get<User[]>(`${this.resourceUrl}/email`, {  observe: 'response' });
    }


    delete(id: number): Observable<HttpResponse<any>>{
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    activerDesactiver(user: User): Observable<EntityResponseType> {
        return this.http.put<User>(`${this.resourceUrl}/active-desactive-user/${user.id}`, user, { observe: 'response' });
    }
   
   
   
    isActive(id: number): Observable<HttpResponse<any>>{
        return this.http.put<any>(`${this.resourceUrl}/active-desactive-user/${id}`, { observe: 'response' });
    }



}
