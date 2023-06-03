import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { PersonasService } from 'src/app/services/param/personas/personas.service';
import { HttpClient } from '@angular/common/http';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';

declare var Swal:any;
declare var $: any;
declare var saveAs:any;

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements AfterViewInit {

  @ViewChild('myCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  model = new Model();

  file: any;

  constructor(private api:ApiService, private apiP:PersonasService, private Utilidades:UtilidadesService){
    this.obtenerPersonas();
    this.obtenerUnidadesPadre();
    var tipo_persona = localStorage.getItem("SG_TIPO_PERSONA");
    if(tipo_persona != null){
      this.model.tipoPersonalist = JSON.parse(tipo_persona);
    }

    var grados =  localStorage.getItem("SG_GRADOS");
    if(grados != null){
      this.model.gradosList = JSON.parse(grados);
    }
  }

  ngAfterViewInit(): void {
    let context = this.canvas?.nativeElement.getContext('2d');
    if (context) {
      this.ctx = context;

      this.loadImage(this.ctx, this.model.filename);
    }
  }

  obtenerPersonas(){
    this.apiP.getPersonas().subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        response.result.forEach((x: any) => {
          x.existe_img = (x.imagen == null) ? 0 : 1;
          if(x.grado == null){
            x.grado2 = "";
          }else{
            x.grado2 = x.grado + "-";
          }
          x.nombre_grado = x.grado2 + x.nombres + " " + x.apellidos;
        });
        this.model.varhistorial = response.result;
      }
    })
  }

  Crear(){
    this.model.modal = true;
    this.model.isCrear = true;
    this.model.title = 'Crear Persona';
  }

  closeModal(evento:any){
    this.model.modal = false;
    this.model.isCrear = false;
    this.model.varPersona = new Model().varPersona;

    var img = new Image;
    img.src = "../../../../assets/images/avatar.jpg";
    img.onload = () => {
      this.ctx.canvas.width = img.width;
      this.ctx.canvas.height = img.height;
      this.ctx.drawImage(img, 0, 0);
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

  onFileSelected(event: any) {
    this.model.selectedFile = event.target.files[0] as File;
    this.model.varPersona.nombre_imagen = event.target.files[0].name;
    // this.changeMultimedia(event);
  }

  changeMultimedia = ($event: Event) => {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    // this.model.Multimedia = file;
    // this.model.nombreMultimedia = ' ...' + file.name;
    // this.convertToBase64(file)
    
    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      Swal.fire({
        "title": 'Error',
        "text": "Sólo se admiten imágenes.",
        "icon": "error"
      });
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => {
      this.model.nombreMultimedia = ' ...' + file.name;
      this.model.varPersona.imagen = reader.result;
      this.model.imagen = reader.result;
    }
  }

  changeFileImage(event: any) {
    this.file = event.target.files[0];
  
    this.model.filename = this.file.name;
    this.model.varPersona.tipo_imagen = this.file.name.substr(this.file.name.indexOf('.'));
  
    this.ctx?.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = e => {
       this.model.imagen = e.target?.result;
       this.loadImage(this.ctx, e.target?.result);
    };
  }
  
  convertToBase64(file: File) {
    const base64 = new Observable((subscriber: Subscriber<any>) => {
      this.LeerArchivo(file, subscriber);
    });
    base64.subscribe((d) => {
      this.model.base64 = d;
      this.model.MultimediaBase64 = d;
      this.model.imagen = d;
    })
  }

  LeerArchivo(file: File, subscriber: Subscriber<any>) {
    const lector = new FileReader();
    lector.readAsDataURL(file);
    lector.onload = () => {
      subscriber.next(lector.result);
      subscriber.complete();
    };
    lector.onerror = (error) => {
      Swal.fire({
        title: '<strong>HTML <u>ERROR</u></strong>',
        icon: 'warning',
        html: '<b>Seleccione un Archivo</b>',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:'<i class="fa fa-thumbs-up"></i> Aceptar!'
      });
      subscriber.error(error);
      subscriber.complete();
    };
  }

  editar(datos:any){
    this.model.modal = true;
    this.model.title = 'Actualilzar Persona';
    this.model.varPersona = datos;

    if(this.model.varPersona.unidad != 0 && this.model.varPersona.unidad != ""){
      this.obtenerUnidadesHijas(this.model.varPersona.unidad);
    }

    if (datos.existe_img == 1) {
      let foto = this.api.imagen_folder + datos.imagen;
      this.loadImage(this.ctx, foto);
    }
    else {
      this.loadImage(this.ctx, this.model.filename);
    }
  }

  guardar(num:number){
    if(num == 1) {
      if (this.file) this.model.varPersona.imagen = this.model.imagen?.toString().substring(this.model.imagen?.toString().indexOf(',') + 1);
      else this.model.varPersona.imagen = null;
     
      this.model.varPersona.numero_identificacion = Number(this.model.varPersona.numero_identificacion);
      this.model.varPersona.dependencia = Number(this.model.varPersona.dependencia);
      this.model.varPersona.unidad = Number(this.model.varPersona.unidad);
      this.model.varPersona.usuario = this.Utilidades.UsuarioConectado();
      this.apiP.CrearPersona(this.model.varPersona).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: 'Personas',
            text: response.mensaje,
            allowOutsideClick: false,
            showConfirmButton: true,
            icon: 'success'
          })
          this.closeModal(false);
        }
      });
    }
    else{
      if (this.file) this.model.varPersona.imagen = this.model.imagen?.toString().substring(this.model.imagen?.toString().indexOf(',') + 1);
      else this.model.varPersona.imagen = null;

      this.apiP.ActualizarPersona(this.model.varPersona).subscribe(data=>{
        let response:any = this.api.ProcesarRespuesta(data);
        if(response.tipo == 0){
          Swal.fire({
            title: 'Personas',
            text: response.mensaje,
            allowOutsideClick: false,
            showConfirmButton: true,
            icon: 'success'
          });
          this.closeModal(false);
        }
      });
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
}
