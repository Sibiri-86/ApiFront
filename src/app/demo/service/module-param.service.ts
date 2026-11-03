import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../components/model/util.model';
import { ModuleParam } from 'src/app/store/module-param/model';
import { MenuAction } from 'src/app/store/menu/model';
type EntityResponseType = HttpResponse<ModuleParam>;
type EntityArrayResponseType = HttpResponse<ModuleParam[]>;

@Injectable({
  providedIn: 'root'
})
export class ModuleParamService {
  public resourceUrl = API_URL + '/moduleParams';

  constructor(protected http: HttpClient) {}
  
  create(moduleParam: ModuleParam): Observable<EntityResponseType> {
      return this.http.post<ModuleParam>(this.resourceUrl, moduleParam, { observe: 'response' });
  }
  
  update(moduleParam: ModuleParam): Observable<EntityResponseType> {
      return this.http.put<ModuleParam>(`${this.resourceUrl}/${moduleParam.id}`, moduleParam, { observe: 'response' });
  }
  
  deleteAll(moduleParams: ModuleParam[]): Observable<EntityArrayResponseType> {
      return this.http.put<ModuleParam[]>(`${this.resourceUrl}/all`, moduleParams, { observe: 'response' });
  }
  
  find(id: number): Observable<EntityResponseType> {
      return this.http.get<ModuleParam>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findMenuByModule(idModule: number): Observable<HttpResponse<MenuAction[]>> {
    return this.http.get<MenuAction[]>(`${this.resourceUrl}/menus/${idModule}`, { observe: 'response' });
}
  
  query(req?: any): Observable<EntityArrayResponseType> {
      return this.http.get<ModuleParam[]>(this.resourceUrl, { observe: 'response' });
  }
  
  delete(id: number): Observable<HttpResponse<any>> {
      return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
