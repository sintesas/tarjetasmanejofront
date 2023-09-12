import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class UnidadesService {
  constructor(private http: HttpClient, private api: ApiService) { }

  private apiGetUnidades = this.api.getBaseUrl + "param/unidad";
  private apiCrearUnidades = this.api.getBaseUrl + "param/unidad/crearunidad";
  private apiActualizarUnidades = this.api.getBaseUrl + "param/unidad/actualizarunidad";
  private apiObtenerByIdUnidades = this.api.getBaseUrl + "param/unidad/obtenerunidadesByid";
  private apiObtenerUnidad = this.api.getBaseUrl + "param/unidad/obtenerunidad";
  private apiObtenerDependencia = this.api.getBaseUrl + "param/unidad/obtenerDependencia";

  public getUnidades(): Observable<any> {
    return this.http.get<any>(this.apiGetUnidades, 
      this.api.getOptions('g')).pipe(retry(1), 
        catchError(this.api.errorHandle)
      );
  }

  public CrearUnidad(data: any): Observable<any> {
    return this.http.post<any>(this.apiCrearUnidades, data, 
      this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public ActualizarUnidad(data: any): Observable<any> {
    return this.http.post<any>(this.apiActualizarUnidades, data,
       this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public ObtenerUnidadByID(data: any): Observable<any> {
    return this.http.post<any>(this.apiObtenerByIdUnidades, data, 
      this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public ObtenerUnidad(data: any): Observable<any> {
    return this.http.post<any>(this.apiObtenerUnidad, data, 
      this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public ObtenerDependencia(data: any): Observable<any> {
    return this.http.post<any>(this.apiObtenerDependencia, data, 
      this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }
}