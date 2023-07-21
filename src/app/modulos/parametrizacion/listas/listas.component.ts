import { Component } from '@angular/core';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
import { ListasService } from 'src/app/services/param/listas/listas.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';
import { Validaciones } from './validaciones';

declare var Swal:any;

export class Permiso {
  consultar: any;
  crear: any;
  actualizar: any;
  eliminar: any;
}

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss']
})

export class ListasComponent {
  Validaciones = new Validaciones();
  model = new Model();
  p = new Permiso();

  constructor(private apiLD:ListasService, private api:ApiService, private utilidades: UtilidadesService, private usuarioService: UsuariosService){
    this.grilla();
    this.model.usuario = this.utilidades.UsuarioConectado();
    this.getPermisos();
  }

  grilla(){
    this.apiLD.getListas().subscribe(data=>{
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
        this.model.varhistorialTemp = response.result;
      }
    });
  }

  search(dato:any){
    let filtro = dato.value.toLowerCase();
    if(dato.value.length >= 3){
      this.model.varhistorial = this.model.varhistorialTemp.filter((item: any) => {
        if (item.nombre_lista.toString().toLowerCase().indexOf(filtro) !== -1) {
              return true;
            }
            return false;
      });
    }else{
      this.model.varhistorial = this.model.varhistorialTemp;
    }
  }

  clearSearch(dato:any){}
  
  crearLista(num:any,data:any = null){
    this.model.Listas = true;
    if(num == 2){
      this.model.isCrear = false;
      this.model.varLista = data;
      if(this.model.varLista.nombre_lista_padre_id == undefined){
        this.model.varLista.nombre_lista_padre_id = "0";
        this.model.varLista.lista_padre_id = "0";
      }
      this.model.nombre_lista_id = data.nombre_lista_id;
      this.model.varLista.nombre_lista = data.nombre_lista;
      this.ObtenerListasHijos(data.nombre_lista_id)
    }else{
      this.model.isCrear = true;
    }
  }

  ObtenerListasHijos(id:any){
    this.apiLD.ObtenerListas({id:id}).subscribe(data =>{
      let response: any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x: any) => {
          if(x.activo == 1){
            x.estado = true;
          }else{
            x.estado = false;
          }
          x.Nuevoregistro = false;
        });
        this.model.listListas = response.result;
      }
    })
  }

  changePadre(id:number){
    this.apiLD.ObtenerListas({id:id}).subscribe(data =>{
      let response: any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x: any) => {
          if(x.activo == 1){
            x.estado = true;
          }else{
            x.estado = false;
          }
        });
        this.model.listHijos = response.result;
      }
    })
  }

  add(){
    this.model.listListas.push({
      Nuevoregistro:true,
      lista_dinamica:"",
      descripcion:"",
      atributo1:"",
      atributo2:"",
      activo:true
    });
  }

  delete(index:number){
    this.model.listListas.splice(index, 1);
  }

  guardar(){
    //guardar datos lista padre
    if(this.model.varLista.nombre_lista == "" || this.model.varLista.nombre_lista == null || this.model.varLista.nombre_lista == undefined){
      Swal.fire({
        title: "Error",
        text: "LLene el Campo Nombre Lista",
        icon: "warning"
      });
    }else{
      if(this.model.isCrear == true){
        this.model.varLista.usuario= this.utilidades.UsuarioConectado();
        this.model.varLista.nombre_lista_padre_id = Number(this.model.varLista.nombre_lista_padre_id);
        this.model.varLista.lista_padre_id = Number(this.model.varLista.lista_padre_id);
        this.apiLD.crearLista(this.model.varLista).subscribe(data=>{
          let response:any = this.api.ProcesarRespuesta(data);
          if(response.tipo == 0){
            this.model.nombre_lista_id = response.id;
            Swal.fire({
              title: 'Listas Dinamicas',
              text: response.mensaje,
              allowOutsideClick: false,
              showConfirmButton: true,
              icon: 'success'
            });
            this.guardarHijos();
          }
        })
      }else{
        this.model.varLista.usuario= this.utilidades.UsuarioConectado();
        this.model.varLista.nombre_lista_padre_id = Number(this.model.varLista.nombre_lista_padre_id);
        this.model.varLista.lista_padre_id = Number(this.model.varLista.lista_padre_id);
        this.apiLD.actualizarLista(this.model.varLista).subscribe(data=>{
          let response:any = this.api.ProcesarRespuesta(data);
          if(response.tipo == 0){
            this.model.nombre_lista_id = response.id;
            Swal.fire({
              title: 'Listas Dinamicas',
              text: response.mensaje,
              allowOutsideClick: false,
              showConfirmButton: true,
              icon: 'success'
            });
            this.guardarHijos();
          }
        })
      }
      this.grilla();
    }
  }

  guardarHijos(){
    //guardar datos hijos
    let respuesta = this.Validaciones.validarListas(this.model);
    if(respuesta.error == false){
      this.model.listListas.forEach((x:any) => {
        x.usuario = this.utilidades.UsuarioConectado();
        x.nombre_lista_id = Number(this.model.nombre_lista_id);
        if(x.Nuevoregistro == true){
          this.apiLD.crearListah(x).subscribe(data=>{});
        }else{
          this.apiLD.actualizarListah(x).subscribe(data=>{});
        }
      });
          //recarga hijos
      let time = (this.model.listHijos.length * 1000) + 2000;
      setTimeout(() => {
        this.ObtenerListasHijos(this.model.nombre_lista_id);
      }, time);
    }else{
      Swal.fire({
        title: "Error",
        text: respuesta.msg_error,
        icon: "warning"
      });
    }
  }

  closeLd(){
    this.model.Listas = false;
    this.model.listListas = new Model().listListas;
    this.model.varLista = new Model().varLista;
    this.grilla();
  }

  checkbox(num:Number,data:any,check:boolean){
    if(num == 1){
      let json = {
        nombre_lista_id: data.nombre_lista_id,
        nombre_lista:data.nombre_lista,
        activo: check,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiLD.actualizarLista(json).subscribe(data=>{});
      this.grilla();
      if(this.model.nombre_lista_id != 0){
        this.ObtenerListasHijos(this.model.nombre_lista_id);
      }
    }else{
      let json = {
        lista_dinamica_id: data.lista_dinamica_id,
        nombre_lista_id: this.model.nombre_lista_id,
        lista_dinamica: data.lista_dinamica,
        activo: check,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiLD.actualizarListah(json).subscribe(data=>{});
      this.grilla();
      if(this.model.nombre_lista_id != 0){
        this.ObtenerListasHijos(this.model.nombre_lista_id);
      }
    }
  }

  getPermisos() {
    let dato = this.utilidades.DatosUsuario();
    let json = {
      usuario: dato.usuario,
      cod_modulo: 'PM'
    }

    this.usuarioService.getPermisos(json).subscribe(data => {
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
