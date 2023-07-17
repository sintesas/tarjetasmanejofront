import { Component, ElementRef, ViewChild } from '@angular/core';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
import { TarjetasService } from 'src/app/services/tarjetas/tarjetas.service';
import { PersonasService } from 'src/app/services/param/personas/personas.service';
import { Validaciones } from './validaciones';

declare var Swal:any;
declare var  require:any;
const FileSaver = require('file-saver');
const SG_TIPO_PERSONA = "SG_TIPO_PERSONA";
const SG_GRADOS = "SG_GRADOS";
const TM_TIPO = "TM_TIPO";
const TM_CLASIFICACION = "TM_CLASIFICACION";

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

  validaciones = new Validaciones();

  base64!: any;

  p = new Permiso();

  url: any;

  constructor(private api: ApiService, private apiP: PersonasService, private apiU:UsuariosService, private apiT:TarjetasService, private Utilidades:UtilidadesService){
    this.Utilidades.ObtenerListas(SG_TIPO_PERSONA);
    this.Utilidades.ObtenerListas(SG_GRADOS);
    this.Utilidades.ObtenerListas(TM_TIPO);
    this.Utilidades.ObtenerListas(TM_CLASIFICACION);
    this.getPermisos();
    this.obtenergrilla();
    this.obtenerUnidadesPadre();

    var grados = localStorage.getItem("SG_GRADOS");
    if(grados != null){
      this.model.gradosList = JSON.parse(grados);
    }

    var tipos = localStorage.getItem("TM_TIPO");
    if(tipos != null){
      this.model.tiposList = JSON.parse(tipos);
    }

    var clasificacion = localStorage.getItem("TM_CLASIFICACION");
    if(clasificacion != null){
      this.model.clasificacionList = JSON.parse(clasificacion);
    }
  }

  obtenerUnidadesPadre(){
    this.apiP.getUnidadesPadre().subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        this.model.listUnidadesP = response.result;
      }
    })
  }

  obtenerUnidadesHijas(num:number){
    this.apiP.getUnidadesHijas({id:num}).subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        this.model.listUnidadesH = response.result;
      }
    });
  }

  obtenergrilla(){
    this.apiT.Tarjetas().subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x:any) => {
          x.grado_nombre = this.model.gradosList.filter((g:any) => g.lista_dinamica_id == x.grado)[0].lista_dinamica;
          x.existe_img = (x.imagen == null || x.imagen == "") ? 0 : 1;
          if(x.grado == null){
            x.grado2 = "";
          }else{
            x.grado2 = x.grado_nombre + "-";
          }
          x.nombre_grado = x.grado2 + x.nombres + " " + x.apellidos;
          x.restringe_da = x.restringe_da == 1 ? true : false;
        });
        this.model.varhistorial = response.result;
        this.model.varhistorialTemp = response.result;
      }
    })
  }

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

  search(dato:any){
    let filtro = dato.value.toLowerCase();
    if(dato.value.length >= 3){
      this.model.varhistorial = this.model.varhistorialTemp.filter((item: any) => {
        if (item.nombre_grado.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.numero_identificacion.toString().toLowerCase().indexOf(filtro) !== -1) {
              return true;
            }
            return false;
      });
    }else{
      this.model.varhistorial = this.model.varhistorialTemp;
    }
  }

  clearSearch(dato:any){}

  CrearTajeta(){
    this.model.isCrear = true;
    this.model.tarjeta = true;
    this.model.isLectura = false;
  }

  buscarPersona(num:number){
    let esEncontrado = this.model.varhistorial.filter((x:any)=>x.numero_identificacion == num);
    if(esEncontrado.length == 0){
      this.apiT.Obtenerdatos({id:num}).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          response.result.forEach((x:any) => {
            x.existe_img = (x.imagen == null || x.imagen == "") ? 0 : 1;
          });
          this.model.varTarjeta = response.result[0];
          if (this.model.varTarjeta.existe_img == 1) {
            let foto = this.api.imagen_folder + this.model.varTarjeta.imagen;
            this.loadImage(this.ctx, foto);
          }
          else {
            this.loadImage(this.ctx, this.model.filename);
          }
        }
      })
    }else{
      Swal.fire({
        title: "Error",
        text: 'EL Documento Ingresado ya Existe Por Favor Consultelo',
        icon: "warning"
      });
    }
  }

  closeT(){
    this.obtenergrilla();
    this.model.tarjeta = false;
    this.model.isLectura = false;
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
    this.model.isCrear = false;
    this.model.varTarjeta = datos;
    this.model.tarjeta = true;
    this.model.isLectura = false;
    this.apiT.ObtenerTarjetas({id:datos.persona_id}).subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x:any) => {
          x.Nuevoregistro = false;
          x.url_acta = this.api.acta_folder + x.ruta_acta;
          x.url_reserva = this.api.reserva_folder + x.ruta_reserva;
        });

        this.model.listTarjetas = response.result;
      }
    })
    if (datos.existe_img == 1) {
      let foto = this.api.imagen_folder + datos.imagen;
      this.loadImage(this.ctx, foto);
    }
    else {
      this.loadImage(this.ctx, this.model.filename);
    }
  }

  detalle(datos:any){
    this.model.isCrear = false;
    this.model.varTarjeta = datos;
    this.model.tarjeta = true;
    this.model.isLectura = true;
    this.apiT.ObtenerTarjetas({id:datos.persona_id}).subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x:any) => {
          x.Nuevoregistro = false;
          x.url_acta = this.api.acta_folder + x.ruta_acta;
          x.url_reserva = this.api.reserva_folder + x.ruta_reserva;
        });

        this.model.listTarjetas = response.result;
      }
    })
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
      tipo_id:0,
      clasificacion_id:0,
      vigencia:"",
      fecha_inicio: this.Utilidades.parseFecha(new Date(),false,4),
      fecha_fin:"",
      unidad:this.model.varTarjeta.nombre_unidad,
      dependencia:this.model.varTarjeta.nombre_dependencia,
      cargo:this.model.varTarjeta.cargo,
      gr_nombre:"",
      gr_cargo:"",
      activo:true,
      Nuevoregistro:true
    });
  }

  delete(index:number){
    this.model.listTarjetas.splice(index, 1);
  }

  guardar(){
    let respuesta = this.validaciones.validarTarjeta(this.model);
    if(respuesta.error == false){
      this.model.listTarjetas.forEach((x:any) => {
        x.persona_id = this.model.varTarjeta.persona_id;
        x.usuario = this.Utilidades.UsuarioConectado();
        x.restringe_da = this.model.varTarjeta.restringe_da;
        var datos:any = new FormData();
        datos.append('modelo',JSON.stringify(x));
        datos.append('acta', x.acta);
        datos.append('reserva', x.reserva);
        if(x.Nuevoregistro == true){
          this.apiT.crearTarjeta(datos).subscribe(data=>{});
        }else{
          this.apiT.actualizarTarjetas(datos).subscribe(data=>{});
        }
      });
      Swal.fire({
        title: 'Tarjetas de Manejo',
        text: 'Accion realizada con exito',
        allowOutsideClick: false,
        showConfirmButton: true,
        icon: 'success'
      });
      this.closeT();
    }else{
      Swal.fire({
        title: 'Tarjetas de Manejo',
        text: respuesta.msg_error,
        allowOutsideClick: false,
        showConfirmButton: true,
        icon: 'warning'
      });
    }
  }

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

  changefileActa(data:any, index:any){
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + '-' + hoy.getMinutes() + '-' + hoy.getSeconds();
    var fechaYHora = fecha + hora;

    this.model.listTarjetas[index].acta = data.target.files[0];
    this.model.listTarjetas[index].acta_nombre = 'acta'+this.model.varTarjeta.numero_identificacion+fechaYHora;
    Swal.fire({
      title: "Tarjetas",
      text: "Archivo Cargado con Exito",
      icon: "success"
    });
  }
  
  changefileReserva(data:any, index:any){
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + '-' + hoy.getMinutes() + '-' + hoy.getSeconds();
    var fechaYHora = fecha + hora;

    this.model.listTarjetas[index].reserva = data.target.files[0];
    this.model.listTarjetas[index].reserva_nombre = 'reserva'+this.model.varTarjeta.numero_identificacion+fechaYHora;
    Swal.fire({
      title: "Tarjetas",
      text: "Archivo Cargado con Exito",
      icon: "success"
    });
  }

  descargarDoc(URL:String,PDFName:String,num:number){
    let nombre = "";
    if(num == 1){
      nombre = "Acta "+PDFName;
    }else{
      nombre = "Reserva "+PDFName;
    }
    FileSaver.saveAs(URL, nombre);
  }

  vigencia(index:number,id:number){
    let lista = this.model.clasificacionList.filter((x:any)=> x.lista_dinamica_id == id);
    this.model.listTarjetas[index].vigencia = lista[0].atributo1;

    const fechaInicial = new Date(this.model.listTarjetas[index].fecha_inicio); // Aquí puedes poner la fecha inicial que desees

    const diasASumar = this.model.listTarjetas[index].vigencia; // Aquí puedes poner el número de días que deseas sumar

    const fechaFinal = new Date(fechaInicial.getTime() + diasASumar * 24 * 60 * 60 * 1000);

    const año = fechaFinal.getFullYear();
    const mes = fechaFinal.getMonth() + 1;
    const día = fechaFinal.getDate();

    this.model.listTarjetas[index].fecha_fin = `${año}-${mes.toString().padStart(2, '0')}-${día.toString().padStart(2, '0')}`;
  }

  changefechaInicio(index:number){
    const fechaInicial = new Date(this.model.listTarjetas[index].fecha_inicio); // Aquí puedes poner la fecha inicial que desees

    const diasASumar = this.model.listTarjetas[index].vigencia; // Aquí puedes poner el número de días que deseas sumar

    const fechaFinal = new Date(fechaInicial.getTime() + diasASumar * 24 * 60 * 60 * 1000);

    const año = fechaFinal.getFullYear();
    const mes = fechaFinal.getMonth() + 1;
    const día = fechaFinal.getDate();

    this.model.listTarjetas[index].fecha_fin = `${año}-${mes.toString().padStart(2, '0')}-${día.toString().padStart(2, '0')}`;
  }
}
