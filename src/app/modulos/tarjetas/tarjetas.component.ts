import { Component, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('myCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  
  model = new Model();

  p = new Permiso();

  constructor(private api: ApiService, private apiU:UsuariosService, private Utilidades:UtilidadesService){
    this.getPermisos();
    this.obtenergrilla();

    var grados =  localStorage.getItem("SG_GRADOS");
    if(grados != null){
      this.model.gradosList = JSON.parse(grados);
    }
  }

  obtenergrilla(){}

  ngAfterViewInit(): void {
    let context = this.canvas?.nativeElement.getContext('2d');
    if (context) {
      this.ctx = context;

      this.loadImage(this.ctx, this.model.filename);
    }
  }

  loadImage(ctx: any, filename: any) {
    var img = new Image;
    img.src = filename;
    img.onload = () => {
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    }
  }

  search(dato:any){}

  clearSearch(dato:any){}

  CrearTajeta(){
    this.model.tarjeta = true;
  }

  closeT(){
    this.model.tarjeta = false;
    this.model.varTarjeta = new Model().varTarjeta;
    this.model.listTarjetas = new Model().listTarjetas;
    this.obtenergrilla();
    var img = new Image;
    img.src = "../../../assets/images/avatar.jpg";
    img.onload = () => {
      this.ctx.canvas.width = img.width;
      this.ctx.canvas.height = img.height;
      this.ctx.drawImage(img, 0, 0);
    }
  }

  editar(datos:any){
    if (datos.existe_img == 1) {
      let foto = this.api.imagen_folder + datos.imagen;
      this.loadImage(this.ctx, foto);
    }
    else {
      this.loadImage(this.ctx, this.model.filename);
    }
  }

  add(){
    this.model.listTarjetas.push({
      tipo:0,
      clasificacion:0,
      vigencia:"",
      fecha_inicio: this.Utilidades.parseFecha(new Date(),false,4),
      fecha_fin:"",
      unidad:0,
      dependencia:0,
      cargo:"",
      gr_nombre:"",
      gr_cargo:"",
      activo:true
    });
  }

  delete(index:number){
    this.model.listTarjetas.splice(index, 1);
  }

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
