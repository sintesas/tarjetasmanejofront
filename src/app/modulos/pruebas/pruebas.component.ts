import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { PruebaService } from 'src/app/services/modulos/prueba/prueba.service';
@Component({
  selector: 'app-pruebas',
  templateUrl: './pruebas.component.html',
  styleUrls: ['./pruebas.component.scss']
})
export class PruebasComponent {
  constructor(private pruebaApi: PruebaService, private api: ApiService){}

  ngOnInit() {
    this.pruebaApi.ObtenerPrueba().subscribe(data=> {
      let response = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
      }
    });
  }
}
