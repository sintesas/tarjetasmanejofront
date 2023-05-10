import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ApiService } from '../../api.service';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  
  private apiObtnerBanner = this.api.getBaseUrl + "banner";

  constructor(private http: HttpClient, private api: ApiService) { }

  public ObtenerBanner(): Observable<any> {
    return this.http.get<any>(this.apiObtnerBanner,
      this.api.getOptions('g')).pipe(retry(1), 
      catchError(this.api.errorHandle)
    );
  }
}
