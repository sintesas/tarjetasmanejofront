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
    this.obtenerRoles();
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

  obtenerRoles(){
    this.apiR.getRolesActivos().subscribe(data =>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        this.model.listRoles = response.result;
      }
    })
  }

  saveRol(index:any){
    this.model.listRoles.forEach((x:any) => {
      x.item1 = x.rol;
      // x.item2 = x.pantalla;
    });
    this.model.array = this.model.listRoles;
    this.model.inputform = 'modulo';
    this.model.index = index;
    this.model.selectModal = true;   
  }

  saveModulo(index:any){
    this.model.listPrivilegios.forEach((x:any) => {
      x.item1 = x.modulo; 
      x.item2 = x.nombre_pantalla;
    });
    this.model.array = this.model.listPrivilegios;
    this.model.inputform = 'privilegio';
    this.model.index = index;
    this.model.selectModal = true;
  }

  dataform(inputform: any, data: any) {
    this.model.selectModal = false;
    if (inputform == 'modulo') {
      this.model.varRol[this.model.index].rol_id = data.rol_id;
      this.model.varRol[this.model.index].nombre_rol = data.rol;
      this.apiR.getRolPrivilegiosById({rol_id:data.rol_id}).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          this.model.listPrivilegios = response.result;
        }
      });
    }
    if (inputform == 'privilegio'){
      this.model.varRol[this.model.index].modulo = data.modulo;
      this.model.varRol[this.model.index].nombre_pantalla = data.nombre_pantalla;
      this.model.varRol[this.model.index].activo = data.activo;
    }
  }

  closeSelectModal(bol: any) {
    this.model.selectModal = false;
  }

  guardarAsignacion(){
    console.log(this.model.userdata)
    this.model.varRol.forEach((x:any) => {
      x.usuario_id = this.model.userdata.usuario_id;
      x.usuario = this.Utilidades.UsuarioConectado();
      if(x.NuevoRegistro == true){
        this.apiU.createPrivilegios(x).subscribe(data=>{});
      }else{
        this.apiU.UpdatePrivilegios(x).subscribe(data=>{});
      }
    });
  }
}
