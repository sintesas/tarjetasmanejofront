import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
 
  private apiGetRoles = this.api.getBaseUrl + "admin/roles";
  private apiGetRolesActivos = this.api.getBaseUrl + "admin/rol/getRolesActivos";
  private apiCreateRoles = this.api.getBaseUrl + "admin/rol/crearRol";
  private apiUpdateRoles = this.api.getBaseUrl + "admin/rol/actualizarRol";
  private apiGetRolPrivilegiosById = this.api.getBaseUrl + "admin/rol/getRolPrivilegiosById";
  private apiCreateRolPrivilegios = this.api.getBaseUrl + "admin/rol/crearRolPrivilegios";
  private apiUpdateRolPrivilegios = this.api.getBaseUrl + "admin/rol/actualizarRolPrivilegios";
  private apiDeleteRolPrivilegiosById = this.api.getBaseUrl + "admin/rol/eliminarRolPrivilegiosById";
  private apiGetModulos = this.api.getBaseUrl + "admin/rol/getModulos";

  constructor(private http: HttpClient, private api: ApiService) { }

  public getRoles(): Observable<any> {
    return this.http.get<any>(this.apiGetRoles, this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public getRolesActivos() : Observable<any> {
    return this.http.get<any>(this.apiGetRolesActivos, this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public createRol(data: any): Observable<any> {
    return this.http.post<any>(this.apiCreateRoles, data, this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public updateRol(data: any): Observable<any> {
    return this.http.post<any>(this.apiUpdateRoles, data, this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public getRolPrivilegiosById(data: any): Observable<any> {
    return this.http.post<any>(this.apiGetRolPrivilegiosById, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public createRolPrivilegios(data: any): Observable<any> {
    return this.http.post<any>(this.apiCreateRolPrivilegios, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public updateRolPrivilegios(data: any): Observable<any> {
    return this.http.post<any>(this.apiUpdateRolPrivilegios, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public deleteRolPrivilegiosById(data: any): Observable<any> {
    return this.http.post<any>(this.apiDeleteRolPrivilegiosById, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public getModulos(): Observable<any> {
    return this.http.get<any>(this.apiGetModulos, this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }
}
