import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiObtnerUsuarios = this.api.getBaseUrl + "admin/usuarios";
  private apiCreateUsuarios = this.api.getBaseUrl + "admin/usuarios/crearUsuario";
  private apiUpdateUsuarios = this.api.getBaseUrl + "admin/usuarios/actualizarUsuario";
  private apiBuscandoUsuarios = this.api.getBaseUrl + "admin/usuarios/busqueda";
  private apiCreateprivilegios = this.api.getBaseUrl + "admin/usuarios/crearPrivilegios";
  private apiUpdateprivilegios = this.api.getBaseUrl + "admin/usuarios/actualizarPrivilegios";
  private apiCambiopassword = this.api.getBaseUrl + "admin/usuarios/cambiarContraseña";
  private apiGetRolesAsignados = this.api.getBaseUrl + "admin/usuarios/obtenerRolesAsignados";
  private apiCreateAsignMenu = this.api.getBaseUrl + "admin/usuarios/crearAsignarMenu";
  private apiGetRolPrivilegiosPantalla = this.api.getBaseUrl + "admin/usuarios/getRolPrivilegiosPantalla";
  private apiGetPermisos = this.api.getBaseUrl + "admin/usuarios/getPermisos";

  constructor(private http: HttpClient, private api: ApiService) { }

  public ObtenerUsuarios(): Observable<any> {
    return this.http.get<any>(this.apiObtnerUsuarios,this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public createUsuarios(data: any): Observable<any> {
    return this.http.post<any>(this.apiCreateUsuarios, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public updateUsuarios(data: any): Observable<any> {
    return this.http.post<any>(this.apiUpdateUsuarios, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public BusquedaUsuarios(data: any): Observable<any> {
    return this.http.post<any>(this.apiBuscandoUsuarios, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public createPrivilegios(data: any): Observable<any> {
    return this.http.post<any>(this.apiCreateprivilegios, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public UpdatePrivilegios(data: any): Observable<any> {
    return this.http.post<any>(this.apiUpdateprivilegios, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public Cambiarpassword(data: any): Observable<any> {
    return this.http.post<any>(this.apiCambiopassword, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public ObtenerRolesAsignados(data: any): Observable<any> {
    return this.http.post<any>(this.apiGetRolesAsignados, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public crearAsignarMenu(data: any): Observable<any> {
    return this.http.post<any>(this.apiCreateAsignMenu, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public getRolPrivilegiosPantalla(): Observable<any> {
    return this.http.get<any>(this.apiGetRolPrivilegiosPantalla,this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public getPermisos(data: any): Observable<any> {
    return this.http.post<any>(this.apiGetPermisos, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }
}


