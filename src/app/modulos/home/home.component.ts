import { Component, OnInit } from '@angular/core';
import { Model } from './entidades';
import { HomeService } from 'src/app/services/modulos/home/home.service';
import { ApiService } from 'src/app/services/api.service';
import { Entitys } from 'src/app/entitys';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
// Jquery
declare var $:any;

//SweetAlert2
declare var Swal:any;

const SG_TIPO_PERSONA = "SG_TIPO_PERSONA";
const SG_GRADOS = "SG_GRADOS";
const TM_TIPO = "TM_TIPO";
const TM_CLASIFICACION = "TM_CLASIFICACION";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  model = new Model();
  entity = new Entitys();


  constructor(private apiHome: HomeService, private api: ApiService, private Utilidades:UtilidadesService) {}

  ngOnInit() {
    this.ObtenerBanner();
    let obtenerListas = Number(localStorage.getItem("cargarListas"));
    if(obtenerListas == 1){
      Swal.fire({
        title: 'Porfavor espere!',
        html: 'Cargando Datos',
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: false
      });
      Swal.showLoading();
      localStorage.removeItem("cargarListas");
      this.Utilidades.ObtenerListas(SG_TIPO_PERSONA);
      this.Utilidades.ObtenerListas(SG_GRADOS);
      this.Utilidades.ObtenerListas(TM_TIPO);
      this.Utilidades.ObtenerListas(TM_CLASIFICACION);
      this.reloj();
    }else{
    }
  }

  reloj(){
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = this.checkTime(m);
    s = this.checkTime(s);

    if(h > 0 && h < 13){
      this.model.format = "a.m.";
    }else{
      this.model.format = "p.m.";
    }

    if(h > 12) {
      h = h - 12;
    }

    if(h == 0){
      h = 12;
    }

    this.model.reloj = h + ":" + m;
    let t = setTimeout(() => {
      this.reloj();
    }, 500);
  }

 checkTime(i:any) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  changeBtnRadio(){
    setTimeout(() => {
     $('#play1').prop('checked',true);
    }, 1000);
  }

  ObtenerBanner(){
    this.apiHome.ObtenerBanner().subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      Swal.close();
      if(response.tipo == 0){
        this.model.banner = response.result;
      }
    })
   }
}
