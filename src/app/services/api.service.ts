import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Entitys } from '../entitys';
declare var Swal:any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  entity = new Entitys();
  version =  this.entity.version;
  //tipoAmbiente:any = "Local";
   tipoAmbiente:any = "Produccion";

  ////Producion
   private url = "http://172.20.100.67:85/TarjetasFac/"
   public imagen_folder = this.url + "/public/img/perfil/";
   public acta_folder = this.url + "/public/actas/"
   public reserva_folder = this.url + "/public/reservas/"

  ////local
  //private url = "http://localhost:8000/";
  //public imagen_folder = this.url + "img/perfil/";
  //public acta_folder = this.url + "actas/"
  //public reserva_folder = this.url + "reservas/"
  
  private baseurl = this.url + "api/";

  constructor() { }

  public getOptions(tipo = 'l'): any {
    if (tipo == 'l') {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json;charset=utf8',
          'Data-Type': 'json'
        })
      };
    }
    else if (tipo == 'g') {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Data-Type': 'json'
        })
      };
    }
    else if (tipo == 'b') {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json;charset=utf8',
          'Data-Type': 'json'
        }),
        responseType: 'blob' as 'json'
      };
    }
  }

  get getBaseUrl() {
    return this.baseurl;
  }

  get URL(){
    return this.url;
  }

  /* Error Exceptions */
  public errorHandle(error: any) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.Message;
      Swal.fire({
        icon: 'error',
        text: errorMessage,
        footer: 'Tarjetas '+ this.version
      });
    }
    else {
      if (error.status === 401) {
        errorMessage = "Su sesión ha expirado. Intente conectarse nuevamente.";
        Swal.fire({
          title: 'ERROR AUTENTICACIÓN',
          icon: 'error',
          text: errorMessage,
          footer: 'Tarjetas '+ this.version
        }).then((result: any) => {
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '/login';
          }, 500);
        });
      }
      else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        Swal.fire({
          title: 'ERROR',
          icon: 'error',
          text: errorMessage,
          footer: 'Tarjetas '+ this.version
        });
      }
    }

    return throwError(errorMessage);
  }

  public ProcesarRespuesta(request: any) {
    if (request != undefined && request.tipo != 0 && request.tipo != -1) {
      Swal.fire({
        title: 'ERROR EN EL SISTEMA',
        text: request.mensaje,
        allowOutsideClick: false,
        showConfirmButton: true,
        icon: 'error',
        footer: 'Tarjetas '+ this.version
      })
    }
    if (request != undefined && request.tipo == -1) {
      Swal.fire({
        title: 'ADVERTENCIA',
        text: request.mensaje,
        allowOutsideClick: false,
        showConfirmButton: true,
        icon: 'warning',
        footer: 'Tarjetas '+ this.version
      })
    }
    if (request != undefined && request.tipo == -2) {
      Swal.fire({
        title: 'ERROR',
        icon: 'error',
        text: request.mensaje,
        footer: 'Tarjetas '+ this.version
      }).then((result: any) => {
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/';
        }, 500);
      });
    }

    return request;
  }
}