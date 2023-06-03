import { Component } from '@angular/core';
import { Model } from './entidades';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss']
})
export class TarjetasComponent {
  model = new Model();

  search(dato:any){}

  clearSearch(dato:any){}

  CrearTajeta(){
    this.model.tarjeta = true;
  }

  closeT(){
    this.model.tarjeta = false;
  }

  add(){}

  delete(indice:number){}

  guardar(){}
}
