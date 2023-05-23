import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Entitys } from 'src/app/entitys';
import { LoginService } from '../auth/login.service';

declare var Swal:any;

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private router:Router, private apiL:LoginService) {}
  entity = new Entitys();

  logout(btn = 0){
    this.apiL.logout().subscribe(data=>{});
    if(this.entity.Key != 0){
     if(btn == 0){
        Swal.fire({
          title: 'Perdida de Sesion',
          text: 'Por Favor inicie nuevamente la sesion',
          icon: 'warning',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: false, // Oculta el botón de cancelar
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          // footer: 'Front '+ this.entity.version
        }).then((result:any) => {
          // Aquí puedes agregar lo que quieres hacer después de que el usuario haga clic en "Aceptar"
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
     }else{
      Swal.fire({
        title: 'Cerrando Sesion',
        text: 'Vuelva pronto',
        icon:'success',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false, // Oculta el botón de cancelar
        showConfirmButton:false,
        // footer: 'Front '+ this.entity.version
      });
      setTimeout(() => {
        Swal.close();
        this.router.navigate(['/login']);
      }, 1500);
     }
      localStorage.setItem("llave","0");
    }
  }
}
