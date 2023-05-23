import { Component, OnInit } from '@angular/core';
import { Model } from './entidades';
import { HomeService } from 'src/app/services/modulos/home/home.service';
import { ApiService } from 'src/app/services/api.service';
import { Entitys } from 'src/app/entitys';
// Jquery
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  model = new Model();
  entity = new Entitys();

  constructor(private apiHome: HomeService, private api: ApiService) {}

  ngOnInit() {
    this.reloj();
    this.ObtenerBanner();
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
      if(response.tipo == 0){
        this.model.banner = response.result;
      }
    })
   }
}
