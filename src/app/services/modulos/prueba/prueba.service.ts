import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';
@Injectable({
  providedIn: 'root'
})
export class PruebaService {
  
  private apiPrueba = this.api.getBaseUrl + "pruebas";

  constructor(private http: HttpClient, private api: ApiService) { }

  public ObtenerPrueba(): Observable<any> {
    return this.http.get<any>(this.apiPrueba,
      this.api.getOptions('g')).pipe(retry(1), 
      catchError(this.api.errorHandle)
    );
  }
}
