import { Component } from '@angular/core';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { UnidadesService } from 'src/app/services/param/unidades/unidades.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';

declare var Swal:any;

export class Permiso {
  consultar: any;
  crear: any;
  actualizar: any;
  eliminar: any;
}

@Component({
  selector: 'app-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.scss']
})
export class UnidadesComponent {
  model = new Model();

  p = new Permiso();

  constructor(private api:ApiService, private apiU:UnidadesService, private apiUs:UsuariosService, private utilidades:UtilidadesService){
    this.obtenerUnidades();
  }

  obtenerUnidades(){
    this.apiU.getUnidades().subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x: any) => {
          if(x.activo == 1){
            x.estado = true;
          }else{
            x.estado = false;
          }
        });
        this.model.varhistorial = response.result;
      }
    })
  }

  CrearUnidad(){
    this.model.modalCrear = true;
    this.model.isCrear = true;
  }
  search(dato:any){}

  clearSearch(dato:any){}

  OpenUnidad(data:any){
    this.model.modalCrear = true;
    this.model.isCrear = false;
    this.model.varUnidad.unidad_id = data.unidad_id;
    this.model.varUnidad.nombre_unidad = data.nombre_unidad;
    this.model.varUnidad.denominacion = data.denominacion;
    this.model.varUnidad.ciudad = data.ciudad;
    this.model.varUnidad.direccion = data.direccion;
    this.model.varUnidad.estado = data.estado;
  }

  closeCrear(){
    this.model.modalCrear = false;
    this.model.varUnidad = new Model().varUnidad;
    this.obtenerUnidades();
    this.obtenerDependecias(this.model.unidad_id);
  }

  guardarUnidad(num:number){
    if(this.model.varUnidad.unidad_padre_id == 0){
      this.model.varUnidad.unidad_padre_id = null;
    }
    if(this.model.unidad_id != 0){
      this.model.varUnidad.unidad_padre_id = this.model.unidad_id;
    }
    if(num == 1){
      let json={
        nombre_unidad: this.model.varUnidad.nombre_unidad,
        denominacion: this.model.varUnidad.denominacion,
        ciudad: this.model.varUnidad.ciudad,
        direccion: this.model.varUnidad.direccion,
        unidad_padre_id: this.model.varUnidad.unidad_padre_id,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiU.CrearUnidad(json).subscribe(data =>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: 'Unidades',
            text: response.mensaje,
            allowOutsideClick: false,
            showConfirmButton: true,
            icon: 'success'
          });
          this.closeCrear();
        }
      })
    }else{
      if(this.model.varUnidad.estado == false){
        this.model.varUnidad.activo = 0;
      }else{
        this.model.varUnidad.activo = 1;
      }
      let json={
        unidad_id: this.model.varUnidad.unidad_id,
        nombre_unidad: this.model.varUnidad.nombre_unidad,
        denominacion: this.model.varUnidad.denominacion,
        ciudad: this.model.varUnidad.ciudad,
        direccion: this.model.varUnidad.direccion,
        unidad_padre_id: this.model.varUnidad.unidad_padre_id,
        activo: this.model.varUnidad.activo,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiU.ActualizarUnidad(json).subscribe(data =>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: 'Unidades',
            text: response.mensaje,
            allowOutsideClick: false,
            showConfirmButton: true,
            icon: 'success'
          });
          this.closeCrear();
        }
      })
    }
  }

  openDependencias(data:any){
    this.model.title = data.nombre_unidad;
    this.model.modalDependencias = true;
    this.model.unidad_id = data.unidad_id;
    this.model.varUnidad.unidad_padre_id = data.unidad_id;
    this.obtenerDependecias(data.unidad_id);
  }

  obtenerDependecias(unidad_id:number){
    this.apiU.ObtenerUnidadByID({id:unidad_id}).subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x: any) => {
          if(x.activo == 1){
            x.estado = true;
          }else{
            x.estado = false;
          }
        });
        this.model.varHistorialDependencias = response.result;
      }
    });
  }

  closeDependecias(){
    this.model.varUnidad = new Model().varUnidad;
    this.model.varHistorialDependencias = new Model().varHistorialDependencias;
    this.model.unidad_id = new Model().unidad_id;
    this.model.modalDependencias = false;
    this.obtenerUnidades();
  }

  getPermisos() {
    let dato = this.utilidades.DatosUsuario();
    let json = {
      usuario: dato.usuario,
      cod_modulo: 'PM'
    }

    this.apiUs.getPermisos(json).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        this.p.consultar = response.result.consultar;
        this.p.crear = response.result.crear;
        this.p.actualizar = response.result.actualizar;
        this.p.eliminar = response.result.eliminar;
      }
    })
  }
}
