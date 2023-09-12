import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class ListasService {

  private apiGetListasDinamicas = this.api.getBaseUrl + "param/listas ";
  private apiCrearLista = this.api.getBaseUrl + "param/lista/crearLista";
  private apiActualizarLista = this.api.getBaseUrl + "param/lista/actualizarLista";
  private apiObtenerListas = this.api.getBaseUrl + "param/lista/getListasById";
  private apiObtenerListaspadres = this.api.getBaseUrl + "param/lista/getListasP"
  private apiCrearListah = this.api.getBaseUrl + "param/lista/crearListaDetalle";
  private apiActualizarListah = this.api.getBaseUrl + "param/lista/actualizarListaDetalle";
  private apiObtenerListasByName = this.api.getBaseUrl + "param/lista/getListasByName";
  private apiObtenerLista = this.api.getBaseUrl + "param/lista/getLista";

  constructor(private http: HttpClient, private api: ApiService) { }

  public getListas(): Observable<any> {
    return this.http.get<any>(this.apiGetListasDinamicas, this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public getListasPadre(): Observable<any> {
    return this.http.get<any>(this.apiObtenerListaspadres, this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public crearLista(data:any): Observable<any> {
    return this.http.post<any>(this.apiCrearLista,data,
       this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public actualizarLista(data: any): Observable<any> {
    return this.http.post<any>(this.apiActualizarLista, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
        );
  }

  public ObtenerListas(data: any): Observable<any> {
    return this.http.post<any>(this.apiObtenerListas, JSON.stringify(data), this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public crearListah(data:any): Observable<any> {
    return this.http.post<any>(this.apiCrearListah,data,
       this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public actualizarListah(data: any): Observable<any> {
    return this.http.post<any>(this.apiActualizarListah, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
        );
  }
  
  public GetListaByName(data: any): Observable<any> {
    return this.http.post<any>(this.apiObtenerListasByName, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
        );
  }

  public GetLista(data: any): Observable<any> {
    return this.http.post<any>(this.apiObtenerLista, data,
      this.api.getOptions('g')).pipe(
        retry(1), catchError(this.api.errorHandle)
        );
  }
}
