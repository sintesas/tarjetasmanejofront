import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { Entitys } from '../entitys';
declare var Swal:any;
@Injectable({
  providedIn: 'root'
})
export class AccesoGuard implements CanActivate {
  router = new Router();
  entity = new Entitys();
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    if(this.entity.Key == 0){
      Swal.fire({
        icon: 'error',
        title:'Acceso denegado',
        text: 'Vuelva a iniciar sesion',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        footer: 'Front '+ this.entity.version
      }).then(() => {
        this.router.navigate(['']);
      });
      return false;
    }else{
      return true;
    }
  }
  
}
