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

  public getPersonas(): Observable<any> {
    return this.http.get<any>(this.apiGetPersonas, 
      this.api.getOptions('g')).pipe(retry(1), 
        catchError(this.api.errorHandle)
      );
  }

  public CrearPersona(data: any): Observable<any> {
    return this.http.post<any>(this.apiCrearPersonas, data, 
      this.api.getOptions('b'))
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
}