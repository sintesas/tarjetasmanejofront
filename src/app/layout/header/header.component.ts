import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';
import { ApiService } from 'src/app/services/api.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';

declare var Swal:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
   
  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter();

  currentUser: any;
  showMenu = false;
  modalPerfil:boolean = false;
  varPerfil:any = {
    usuario:""
  };
  roles:any = [];

  constructor(private Sesion:SesionService, private Utilidades:UtilidadesService, private api:ApiService, private apiU:UsuariosService){}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") as any);
  }

  toggle() {
    this.toggleSideBar.emit();
  }

  logout() {
    this.Sesion.logout(1);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  perfil(){
    this.modalPerfil = true;
    let user:any = this.Utilidades.DatosUsuario();
    this.varPerfil.usuario = this.Utilidades.UsuarioConectado();
    this.varPerfil.email = user.email;
    this.varPerfil.nombre_completo = user.nombre_completo;
    this.apiU.ObtenerRolesAsignados({usuario_id:user.usuario_id}).subscribe(data=>{
      let response = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        this.roles = response.result;
      }
    })
  }

  closePerfil(){
    this.modalPerfil = false;
    this.varPerfil = {};
  }

  ChangePassword(){
    let user:any = this.Utilidades.DatosUsuario();
    if(this.varPerfil.passwordNew == this.varPerfil.password2){
      this.apiU.Cambiarpassword({password:this.varPerfil.passwordNew, usuario_id:user.usuario_id}).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title:'Accion Realizada con Exito',
            icon:'success',
            text:'La contraseña ha sido actualizada'
          })
        }
      })
    }else{
      Swal.fire({
        title:'Usuarios',
        icon:'warning',
        text:'Las contraseñas no coinciden'
      })
    }
    this.varPerfil.passwordNew = "";
    this.varPerfil.password2 = "";
  }
}
