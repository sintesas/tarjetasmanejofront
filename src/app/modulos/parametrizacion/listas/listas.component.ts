import { Component } from '@angular/core';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
import { ListasService } from 'src/app/services/param/listas/listas.service';

declare var Swal:any;

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss']
})

export class ListasComponent {
  model = new Model();

  constructor(private apiLD:ListasService, private api:ApiService, private utilidades: UtilidadesService){
    this.grilla();
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
      }
    });
  }
  
  crearListaPadre(num:any,data:any = null){
    this.apiLD.getListasPadre().subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        console.log(response.result);
        response.result.forEach((x:any) => {
          x.nombre_padre = x.nombre_lista + " - " + x.lista_dinamica;
        });
        this.model.listasPadre = response.result;
      }
    })
    this.model.modal = true;
    if(num == 2){
      this.model.varLista = data;
      this.model.isCrear = false;
    }else{
      this.model.isCrear = true;
    }
  }

  guardarListaPadre(data:any,num:Number){
    if(num == 1){
      let json = {
        nombre_lista: data.nombre_lista,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiLD.crearLista(json).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: 'Listas Dinamicas',
            text: response.mensaje,
            allowOutsideClick: false,
            showConfirmButton: true,
            icon: 'success'
          });
          this.closeListaPadre();
        }
      })
    }else{
      let json = {
        nombre_lista_id: data.nombre_lista_id,
        nombre_lista:data.nombre_lista,
        activo: data.activo,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiLD.actualizarLista(json).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: 'Listas Dinamicas',
            text: response.mensaje,
            allowOutsideClick: false,
            showConfirmButton: true,
            icon: 'success'
          });
          this.closeListaPadre();
        }
      })
    }

  }

  closeListaPadre(){
    this.model.varLista = new Model().varLista;
    this.model.modal = false;
    this.grilla();
  }

  closeCrear(){
    this.model.modalCrear = false;
    this.model.varList = new Model().varList;
    this.ObtenerListas(this.model.nombre_lista_id);
  }
  search(dato:any){}

  clearSearch(dato:any){}

  openLd(item:any){
    this.model.Listas = true;
    this.model.nombre_lista_id = item.nombre_lista_id;
    this.model.varLista.nombre_lista = item.nombre_lista;
    this.ObtenerListas(item.nombre_lista_id)
  }

  ObtenerListas(id:any){
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
        this.model.varListas = response.result;
      }
    })
  }

  closeLd(){
    this.model.Listas = false;
  }
  crearLista(data=null, num = 1){
    if(num == 2){
      this.model.varList = data;
      this.model.isCrear = false;
    }else{
      this.model.isCrear = true;
    }
    this.model.modalCrear = true;
  }
  
  closeLista(){
    this.model.modalCrear = false;
  }

  guardarLista(data:any,num:number){
    if(num == 1){
      let json = {
        nombre_lista_id: this.model.nombre_lista_id,
        lista_dinamica: data.lista_dinamica,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiLD.crearListah(json).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: 'Listas Dinamicas',
            text: response.mensaje,
            allowOutsideClick: false,
            showConfirmButton: true,
            icon: 'success'
          });
          this.closeCrear();
        }
      })
    }else{
      let json = {
        lista_dinamica_id: data.lista_dinamica_id,
        nombre_lista_id: this.model.nombre_lista_id,
        lista_dinamica: data.lista_dinamica,
        activo: data.activo,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiLD.actualizarListah(json).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: 'Listas Dinamicas',
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

  checkbox(num:Number,data:any,check:boolean){
    if(num == 1){
      let json = {
        nombre_lista_id: data.nombre_lista_id,
        nombre_lista:data.nombre_lista,
        activo: check,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiLD.actualizarLista(json).subscribe(data=>{});
    }else{
      let json = {
        lista_dinamica_id: data.lista_dinamica_id,
        nombre_lista_id: this.model.nombre_lista_id,
        lista_dinamica: data.lista_dinamica,
        activo: check,
        usuario: this.utilidades.UsuarioConectado()
      }
      this.apiLD.actualizarListah(json).subscribe(data=>{});
    }
  }
}
