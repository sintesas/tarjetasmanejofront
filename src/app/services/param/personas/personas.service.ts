import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  constructor(private http: HttpClient, private api: ApiService) { }

  private apiGetPersonas = this.api.getBaseUrl + "param/persona";
  private apiCrearPersonas = this.api.getBaseUrl + "param/persona/crearpersona";
  // private apiCrearPersonas = this.api.getBaseUrl + "prueba";
  
  private apiActualizarPersonas = this.api.getBaseUrl + "param/persona/actualizarpersona";
  private apiUpload = this.api.getBaseUrl + "param/persona/upload";
  private apiObtenerUnidadesPadre = this.api.getBaseUrl + "param/personas/obtenerunidadespadre";
  private apiObtenerUnidadesHijas = this.api.getBaseUrl + "param/personas/obtenerunidadeshijas";
  private apiObtenerUnidades = this.api.getBaseUrl + "param/personas/ObtenerUnidades";

  public getPersonas(): Observable<any> {
    return this.http.get<any>(this.apiGetPersonas, 
      this.api.getOptions('g')).pipe(retry(1), 
        catchError(this.api.errorHandle)
      );
  }

  public CrearPersona(data: any): Observable<any> {
    return this.http.post<any>(this.apiCrearPersonas, JSON.stringify(data), 
      this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public ActualizarPersona(data: any): Observable<any> {
    return this.http.post<any>(this.apiActualizarPersonas, data,
       this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public Upload(data: any): Observable<any> {
    return this.http.post<any>(this.apiUpload, data, 
      this.api.getOptions('b'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public getUnidadesPadre(): Observable<any> {
    return this.http.get<any>(this.apiObtenerUnidadesPadre, 
      this.api.getOptions('g')).pipe(retry(1), 
        catchError(this.api.errorHandle)
      );
  }

  public getUnidadesHijas(data: any): Observable<any> {
    return this.http.post<any>(this.apiObtenerUnidadesHijas, data,
       this.api.getOptions('g'))
    .pipe(retry(1), catchError(this.api.errorHandle));
  }

  public getUnidades(): Observable<any> {
    return this.http.get<any>(this.apiObtenerUnidades, 
      this.api.getOptions('g')).pipe(retry(1), 
        catchError(this.api.errorHandle)
      );
  }
}