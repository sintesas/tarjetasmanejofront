import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { PersonasService } from 'src/app/services/param/personas/personas.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';
import { Validaciones } from './validaciones';
declare var Swal:any;
declare var $: any;
declare var saveAs:any;
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
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements AfterViewInit {

  @ViewChild('myCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  model = new Model();
  validaciones = new Validaciones();

  p = new Permiso();

  file: any;

  constructor(private api:ApiService, private apiP:PersonasService, private apiU:UsuariosService, private Utilidades:UtilidadesService){
    this.obtenerPersonas();
    this.obtenerUnidades();
    this.getPermisos();
    this.Utilidades.ObtenerListas(SG_TIPO_PERSONA);
    this.Utilidades.ObtenerListas(SG_GRADOS);
    this.Utilidades.ObtenerListas(TM_TIPO);
    this.Utilidades.ObtenerListas(TM_CLASIFICACION);
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
          x.grado_nombre = this.model.gradosList.filter((g:any) => g.lista_dinamica_id == x.grado)[0].lista_dinamica;
          x.existe_img = (x.imagen == null || x.imagen == "") ? 0 : 1;
          if(x.grado == null){
            x.grado2 = "";
          }else{
            x.grado2 = x.grado_nombre + "-";
          }
          x.nombre_grado = x.grado2 + x.nombres + " " + x.apellidos;

          if(x.nombre_unidad == null){
            x.nombre_unidad = "";
          }
          
          if(x.nombre_dependencia == null){
            x.nombre_dependencia = "";
          }

          if(x.cargo == null){
            x.cargo = "";
          }
        });
        this.model.varhistorial = response.result;
        this.model.varhistorialTemp = response.result;
      }
    })
  }

  Crear(){
    this.model.modal = true;
    this.model.isCrear = true;
    this.model.title = 'Crear Persona';
  }

  search(dato:any){
    let filtro = dato.value.toLowerCase();
    if(dato.value.length >= 3){
      this.model.varhistorial = this.model.varhistorialTemp.filter((item: any) => {
        if (item.nombre_grado.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.numero_identificacion.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.cargo.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.persona_id.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.nombre_unidad.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.nombre_dependencia.toString().toLowerCase().indexOf(filtro) !== -1) {
              return true;
            }
            return false;
      });
    }else{
      this.model.varhistorial = this.model.varhistorialTemp;
    }
  }

  closeModal(evento:any){
    this.model.modal = false;
    this.model.isCrear = false;
    this.model.varPersona = new Model().varPersona;
    this.obtenerPersonas();
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
  }

  changeMultimedia = ($event: Event) => {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    
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

  editar(datos:any){
    this.model.modal = true;
    this.model.title = 'Actualilzar Persona';
    this.model.varPersona = datos;
    this.model.varPersona.nom_dependencia = datos.nombre_dependencia;
    this.model.varPersona.nom_unidad = datos.nombre_unidad;
    this.model.varPersona.tmp_numero_identificacion = datos.numero_identificacion;
    this.model.varPersona.tmp_imagen = datos.imagen == "" || datos.imagen == null ? null : datos.imagen;

    if(this.model.varPersona.unidad != 0 && this.model.varPersona.unidad != ""){
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
    let respuesta = this.validaciones.validacionespersonas(this.model);
    if(respuesta.error == false){
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
    }else{
      Swal.fire({
        title: "Error",
        text: respuesta.msg_error,
        icon: "warning"
      });
    }
  }

  obtenerUnidades(){
    this.apiP.getUnidades().subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        this.model.listUnidades = response.result;
        this.model.listUnidades.forEach((x:any) => {
          x.descripcion = x.unidad;
          x.sigla = x.dependencia;
        });
        this.model.array = this.model.listUnidades;
      }
    })
  }

  getPermisos() {
    let dato = this.Utilidades.DatosUsuario();
    let json = {
      usuario: dato.usuario,
      cod_modulo: 'PM'
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

  saveUnidad() {
    ////////////////////////(
    this.model.array = this.model.listUnidades;
    this.model.inputform = 'Unidad-Dependencia';
    // this.model.index = index;
    this.model.selectModal = true;
  }

  dataform(inputform: any, data: any) {
    this.model.selectModal = false;
    if (inputform == 'Unidad-Dependencia') {
      this.model.varPersona.nom_unidad = data.unidad;
      this.model.varPersona.nom_dependencia = data.dependencia;
      if(data.unidad_padre_id != null){
        this.model.varPersona.unidad = data.unidad_padre_id;
        this.model.varPersona.dependencia = data.unidad_id;
      }else{
        this.model.varPersona.unidad = data.unidad_id;
        this.model.varPersona.dependencia = 0;
      }
    }
  }

  closeSelectModal(bol: any) {
    this.model.selectModal = false;
  }
}
