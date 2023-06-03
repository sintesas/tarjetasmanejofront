import { Component } from '@angular/core';
import { Model } from './entidades';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';
import { ApiService } from 'src/app/services/api.service';
import { RolesService } from 'src/app/services/admin/roles/roles.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';

declare var Swal:any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent {
  model = new Model();
  usuario_id = 0;
  
  constructor(private Utilidades:UtilidadesService, private apiU:UsuariosService, private api:ApiService, private apiR:RolesService){
    this.obtenerUsuarios();
  }

  obtenerUsuarios(){
    this.apiU.ObtenerUsuarios().subscribe(data =>{
      let response: any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x:any) => {
          if(x.estado == "S"){
            x.activo = true;
          }else{
            x.activo = false;
          }
        });
        this.model.varhistorialTemp = response.result;
        this.model.varhistorial = response.result;
      }
    })
  }

  create(){
    this.model.isCrear = true;
    this.model.title = "Crear Usuario";
    this.model.modal = true;
  }

  edit(data:any){
    this.model.title = "Editar Usuario";
    this.model.isCrear = false;
    this.model.modal = true;
    this.model.varUsuario = data;
  }

  closeModal(dato:any){
    this.model.modal = false;
    this.model.title = "";
    this.model.varUsuario = new Model().varUsuario;
    this.obtenerUsuarios();
  }

  guardar(num:number){
    this.model.varUsuario.tipo_usuario = 1;
    if(num == 1){
      let existe = this.model.varhistorial.filter((x:any)=>x.usuario == this.model.varUsuario.usuario);
      if(existe.length >=1){
        Swal.fire({
          title:'Usuarios',
          icon:'warning',
          text:'El usuario ya existe, cambielo porfavor'
        })
      }else{
        if(this.model.varUsuario.password != this.model.varUsuario.password2){
          Swal.fire({
            title:'Usuarios',
            icon:'warning',
            text:'Las contraseñas no coinciden'
          })
        }
        else{
          this.apiU.createUsuarios(this.model.varUsuario).subscribe(data =>{
            let response:any = this.api.ProcesarRespuesta(data);
            if(response.tipo == 0){
              Swal.fire({
                title: "Usuario",
                text: "Usuario Creado con Exito",
                icon: "success"
              });
              this.closeModal(false);
            }
          })
        }
      }
    }else{
      if(this.model.varUsuario.activo == true){
        this.model.varUsuario.estado = "S";
      }else{
        this.model.varUsuario.estado = "N";
      }
      this.apiU.updateUsuarios(this.model.varUsuario).subscribe(data =>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: "Usuario",
            text: "Usuario Actualizado con Exito",
            icon: "success"
          });
          this.closeModal(false);
        }
      })
    }
  }

  openRolModal(data:any){
    this.model.rolModal = true;
    this.model.userdata = data;
    this.model.usuario = data.usuario;
    this.usuario_id = data.usuario_id;

    this.obtenerRolPrivilegiosPantalla();
    this.ObtenerRolesAsignados(data.usuario_id);
  }

  closeRolModal(dato:any){
    this.model.rolModal = false;
    this.model.usuario = "";
  }

  add(){
    this.model.varRol.push({
      nombre_rol: "",
      modulo: "",
      nombre_pantalla: "",
      activo: true,
      NuevoRegistro: true
    })
  }

  delete(index: Number){
    this.model.varRol.splice(index,1);
  }

  search(dato:any){
    let filtro = dato.value.toLowerCase();
    // let json ={
    //   busqueda: dato.value
    // }
    if(dato.value.length >= 3){
      // this.apiU.BusquedaUsuarios({json}).subscribe(data=>{
      //   let response:any = this.api.ProcesarRespuesta(data);
      //   if(response.tipo == 0){
      //     this.model.varhistorial = response.result;
      //   }
      // })
      this.model.varhistorial = this.model.varhistorialTemp.filter((item: any) => {
        if (item.usuario.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.nombres.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.apellidos.toString().toLowerCase().indexOf(filtro) !== -1) {
              return true;
            }
            return false;
      });
    }else{
      this.model.varhistorial = this.model.varhistorialTemp;
    }
  }

  obtenerRolPrivilegiosPantalla() {
    this.apiU.getRolPrivilegiosPantalla().subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        this.model.listRoles = response.result;
      }
    });
  }

  ObtenerRolesAsignados(id:number){
    this.apiU.ObtenerRolesAsignados({usuario_id:id}).subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x: any) => {
          x.nombre_rol = x.rol;
        });
        this.model.varRol = response.result;
      }
    })
  }

  saveRol(index:any){
    this.model.listRoles.forEach((x:any) => {
      x.descripcion = x.rol;
    });
    this.model.array = this.model.listRoles;
    this.model.inputform = 'modulo';
    this.model.index = index;
    this.model.selectModal = true;
  }

  dataform(inputform: any, data: any) {
    this.model.selectModal = false;
    if (inputform == 'modulo') {
      this.model.varRol[this.model.index].rol_id = data.rol_id;
      this.model.varRol[this.model.index].nombre_rol = data.rol;
      this.model.varRol[this.model.index].modulo = data.modulo;
      this.model.varRol[this.model.index].nombre_pantalla = data.nombre_pantalla;
      this.model.varRol[this.model.index].menu_id = data.menu_id;
      this.model.varRol[this.model.index].rol_privilegio_id = data.rol_privilegio_id;
    }
  }

  closeSelectModal(bol: any) {
    this.model.selectModal = false;
  }

  guardarAsignacion(){
    if (this.model.varRol.length > 0) {
      this.model.varRol.forEach((x:any) => {
        x.usuario_id = this.model.userdata.usuario_id;
        x.usuario = this.Utilidades.UsuarioConectado();
        if (x.NuevoRegistro == true){
          this.apiU.createPrivilegios(x).subscribe(data=>{});
        }else{
          this.apiU.UpdatePrivilegios(x).subscribe(data=>{});
        }
      });

      let menus_id = this.model.varRol.map((x: any) => x.menu_id).join(",");

      let datos_user = this.Utilidades.DatosUsuario();
      let json = {
        usuario_id: this.usuario_id,
        menu_id: menus_id == "" ? null : menus_id,
        usuario: datos_user.usuario
      }
      this.apiU.crearAsignarMenu(json).subscribe(data => {});
    }

    Swal.fire({
      title: 'Asignar Roles',
      text: 'El registro ha guardado exitoso.',
      allowOutsideClick: false,
      showConfirmButton: true,
      icon: 'success'
    }).then((result: any) => {
      this.model.rolModal = false;
      this.obtenerUsuarios();
    })
  }
}
