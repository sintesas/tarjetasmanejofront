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

  constructor(private http: HttpClient, private api: ApiService) { }

  public ObtenerUsuarios(): Observable<any> {
    return this.http.get<any>(this.apiObtnerUsuarios,
      this.api.getOptions('g')).pipe(retry(1), 
      catchError(this.api.errorHandle)
    );
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
}


