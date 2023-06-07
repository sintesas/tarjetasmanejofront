import { Component } from '@angular/core';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';

export class Permiso {
  consultar: any;
  crear: any;
  actualizar: any;
  eliminar: any;
}

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss']
})
export class TarjetasComponent {
  model = new Model();

  p = new Permiso();

  constructor(private api: ApiService, private apiU:UsuariosService, private Utilidades:UtilidadesService){}

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

  getPermisos() {
    let dato = this.Utilidades.DatosUsuario();
    let json = {
      usuario: dato.usuario,
      cod_modulo: 'TM'
    }

    this.apiU.getPermisos(json).subscribe(data => {
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
