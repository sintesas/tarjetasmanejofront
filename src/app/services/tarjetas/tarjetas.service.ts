import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {
  private apiTarjetas = this.api.getBaseUrl + "tarjetas";
  private apiObtenerDatosPersona = this.api.getBaseUrl + "tarjetas/getDatosPersona";
  private apiCrearTarjetas = this.api.getBaseUrl + "tarjetas/crearTarjetas";
  private apiActualizarTarjetas = this.api.getBaseUrl + "tarjetas/actualizarTarjetas";
  private apiGetTarjetas = this.api.getBaseUrl + "tarjetas/obtenerTarjetas";
  private apiGetView = this.api.getBaseUrl + "tarjetas/obtenerDatosView";
  private apiGetUsuarioDA = this.api.getBaseUrl + "tarjetas/obtenerUsuarioDA";
  private apiGetNombreFoto = this.api.getBaseUrl + "tarjetas/buscarImagen";

  constructor(private http: HttpClient, private api: ApiService) { }

  public Tarjetas():Observable<any>{
    return this.http.get<any>(this.apiTarjetas, this.api.getOptions('g')).pipe(
      retry(1),catchError(this.api.errorHandle)
    )
  }
  
  public Obtenerdatos(data: any): Observable<any> {
    return this.http.post<any>(this.apiObtenerDatosPersona, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
      );
  }

  public crearTarjeta(data: any): Observable<any> {
    return this.http.post<any>(this.apiCrearTarjetas, data).pipe(
        retry(1), catchError(this.api.errorHandle)
      );
  }

  public actualizarTarjetas(data: any): Observable<any> {
    return this.http.post<any>(this.apiActualizarTarjetas, data).pipe(
        retry(1), catchError(this.api.errorHandle)
      );
  }

  public ObtenerTarjetas(data: any): Observable<any> {
    return this.http.post<any>(this.apiGetTarjetas, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
      );
  }

  public Imprimir(data:any):Observable<any>{
    return this.http.get<any>(data).pipe(
      retry(1),catchError(this.api.errorHandle)
    )
  }

  public ObtenerViewData(data:any):Observable<any>{
    return this.http.post<any>(this.apiGetView, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
      );
  }

  public ObtenerUsuarioDA(data:any):Observable<any>{
    return this.http.post<any>(this.apiGetUsuarioDA, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
      );
  }

  public ObtenerNombreFoto(data:any):Observable<any>{
    return this.http.post<any>(this.apiGetNombreFoto, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
      );
  }
}