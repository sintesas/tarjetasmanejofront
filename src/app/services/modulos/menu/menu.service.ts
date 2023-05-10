import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  private apiMenu = this.api.getBaseUrl + "menu";

  constructor(private http: HttpClient, private api: ApiService) { }

  public ObtenerMenu(): Observable<any> {
    return this.http.get<any>(this.apiMenu,
      this.api.getOptions('g')).pipe(retry(1), 
      catchError(this.api.errorHandle)
    );
  }
}
