import { Component, ElementRef, ViewChild } from '@angular/core';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
import { TarjetasService } from 'src/app/services/tarjetas/tarjetas.service';
import { PersonasService } from 'src/app/services/param/personas/personas.service';
import { Validaciones } from './validaciones';
import { DomSanitizer } from '@angular/platform-browser';
import { UnidadesService } from 'src/app/services/param/unidades/unidades.service';
import { ListasService } from 'src/app/services/param/listas/listas.service';
import { HttpClient } from '@angular/common/http';


declare var Swal: any;
declare var require: any;
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

  constructor(private api: ApiService, private apiP: PersonasService, private apiU: UsuariosService, private apiUni: UnidadesService, private apiL: ListasService, private apiT: TarjetasService, private Utilidades: UtilidadesService, private sanitizer: DomSanitizer, private http: HttpClient) {
    this.Utilidades.ObtenerListas(SG_TIPO_PERSONA);
    this.Utilidades.ObtenerListas(SG_GRADOS);
    this.Utilidades.ObtenerListas(TM_TIPO);
    this.Utilidades.ObtenerListas(TM_CLASIFICACION);
    this.getPermisos();
    this.obtenergrilla();
    this.obtenerUnidadesPadre();
    this.showError = false;

    var tipo_persona = localStorage.getItem("SG_TIPO_PERSONA");
    if (tipo_persona != null) {
      this.model.tipoPersonalist = JSON.parse(tipo_persona);
    }

    var grados = localStorage.getItem("SG_GRADOS");
    if (grados != null) {
      this.model.gradosList = JSON.parse(grados);
    }

    var tipos = localStorage.getItem("TM_TIPO");
    if (tipos != null) {
      this.model.tiposList = JSON.parse(tipos);
    }

    var clasificacion = localStorage.getItem("TM_CLASIFICACION");
    if (clasificacion != null) {
      this.model.clasificacionList = JSON.parse(clasificacion);
    }
  }

  ngOnInit(): void {
    this.url = "<iframe src=\"{0}\" width=\"100%\" height=\"500\"><iframe>";
  }

  obtenerUnidadesPadre() {
    this.apiP.getUnidadesPadre().subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        this.model.listUnidadesP = response.result;
      }
    })
  }

  obtenerUnidadesHijas(num: number) {
    this.apiP.getUnidadesHijas({ id: num }).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        this.model.listUnidadesH = response.result;
      }
    });
  }

  obtenergrilla() {
    this.apiT.Tarjetas().subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        response.result.forEach((x: any) => {
          const gradoEncontrado = this.model.gradosList.find((g: any) => g.lista_dinamica_id == x.grado);
          if (gradoEncontrado) {
            x.grado_nombre = gradoEncontrado.lista_dinamica;
          } else {
            // Manejar el caso en que no se encuentra un grado
            x.grado_nombre = "Grado no encontrado";
          }
          x.existe_img = (x.imagen == null || x.imagen == "") ? 0 : 1;
          if (x.grado == null) {
            x.grado2 = "";
          } else {
            x.grado2 = x.grado_nombre + "-";
          }
          x.nombre_grado = x.grado2 + x.nombres + " " + x.apellidos;
          x.restringe_da = x.restringe_da == 1 ? true : false;
        });
        this.model.varhistorial = response.result;
        this.model.varhistorialTemp = response.result;
      }
    });
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

  search(dato: any) {
    let filtro = dato.value.toLowerCase();
    if (dato.value.length >= 3) {
      this.model.varhistorial = this.model.varhistorialTemp.filter((item: any) => {
        if (item.nombre_grado.toString().toLowerCase().indexOf(filtro) !== -1 ||
          item.numero_identificacion.toString().toLowerCase().indexOf(filtro) !== -1) {
          return true;
        }
        return false;
      });
    } else {
      this.model.varhistorial = this.model.varhistorialTemp;
    }
  }

  clearSearch(dato: any) { }

  CrearTajeta() {
    this.model.isCrear = true;
    this.model.tarjeta = true;
    this.model.isLectura = false;
  }

  buscarPersona(num: number) {
    Swal.fire({
      title: 'Buscando Datos...',
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    let esEncontrado = this.model.varhistorial.filter((x: any) => x.numero_identificacion == num);
    if (esEncontrado.length == 0) {
      this.apiT.Obtenerdatos({ id: num }).subscribe(data => {
        let response: any = this.api.ProcesarRespuesta(data);
        if (response.tipo == 0 && response.result[0] != null) {
          Swal.close();
          this.buscarFoto();
          response.result.forEach((x: any) => {
            x.existe_img = (x.imagen == null || x.imagen == "") ? 0 : 1;
          });
          this.model.varTarjeta = response.result[0];
        } else {
          this.apiT.ObtenerViewData({ id: num }).subscribe(data1 => {
            let response1: any = this.api.ProcesarRespuesta(data1);
            if (response1.tipo == 0 && response1.result[0] != null) {
              let datos = response1.result[0];
              this.CrearPersona(datos, num);
            } else {
              Swal.fire({
                title: 'Error',
                text: 'La persona no pudo ser encontrada, por favor créela en Personas',
                icon: 'error',
                allowOutsideClick: false,
                showCancelButton: false,
                showConfirmButton: true,
              });
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: "Error",
        text: 'EL Documento Ingresado ya Existe Por Favor Consultelo',
        icon: "warning"
      });
    }
  }



  CrearPersona(datos: any, num: number) {
    let unidad: any = {
      unidad: 0,
      dependencia: 0
    };
    let usuarioDA = ""
    this.apiT.ObtenerUsuarioDA({ id: num }).subscribe(data9 => {
      let response9: any = this.api.ProcesarRespuesta(data9);
      if (response9.tipo == 0 && response9.result[0] != null) {
        usuarioDA = response9.result[0].SAMACCOUNTNAME;
      }
    })
    this.apiUni.ObtenerUnidad({ nombre: datos.Unidad }).subscribe(data2 => {
      let response2: any = this.api.ProcesarRespuesta(data2);
      if (response2.tipo == 0 && response2.result[0] != null) {
        unidad.unidad = response2.result[0].unidad_id;
      } else {
        let json = {
          nombre_unidad: datos.Unidad,
          unidad_padre_id: "",
          usuario: this.Utilidades.UsuarioConectado()
        }
        this.apiUni.CrearUnidad(json).subscribe(data3 => {
          let response3: any = this.api.ProcesarRespuesta(data3);
          if (response3.tipo == 0) {
            unidad.unidad = response3.id;
          }
        });
      }
      setTimeout(() => {
        this.apiUni.ObtenerDependencia({ nombre: datos.Dependencia }).subscribe(data4 => {
          let response4: any = this.api.ProcesarRespuesta(data4);
          if (response4.tipo == 0 && response4.result[0] != null) {
            unidad.dependencia = response4.result[0].unidad_id;
          } else {
            let json = {
              nombre_unidad: datos.Dependencia,
              unidad_padre_id: unidad.unidad,
              usuario: this.Utilidades.UsuarioConectado()
            }
            this.apiUni.CrearUnidad(json).subscribe(data5 => {
              let response5: any = this.api.ProcesarRespuesta(data5);
              if (response5.tipo == 0) {
                unidad.dependencia = response5.id;
              }
            });
          }
        })
      }, 2000);
      //buscar grado
      let nombre_lista_id = this.model.gradosList[0].nombre_lista_id;
      let lista_id = "";
      this.apiL.GetLista({ nombre: datos.Grado, id: nombre_lista_id }).subscribe(data7 => {
        let response7: any = this.api.ProcesarRespuesta(data7);
        if (response7.tipo == 0 && response7.result[0] != null) {
          lista_id = response7.result[0].lista_dinamica_id;
        } else {
          let json = {
            usuario: this.Utilidades.UsuarioConectado(),
            nombre_lista_id: Number(nombre_lista_id),
            lista_dinamica: datos.Grado,
            activo: true
          }
          this.apiL.crearListah(json).subscribe(data8 => {
            let response8: any = this.api.ProcesarRespuesta(data8);
            if (response8.tipo == 0) {
              lista_id = response8.id;
            }
          });
        }
      })
      setTimeout(() => {
        let json = {
          imagen: null,
          numero_identificacion: Number(datos.Identificacion),
          dependencia: Number(unidad.dependencia),
          unidad: Number(unidad.unidad),
          usuario: this.Utilidades.UsuarioConectado(),
          grado: lista_id,
          nombres: datos.Nombres,
          apellidos: datos.Apellidos,
          tipo_persona: this.model.tipoPersonalist.filter((p: any) => p.lista_dinamica == 'Militar')[0].lista_dinamica_id,
          cargo: datos.Cargo,
          usuario_da: usuarioDA
        }
        this.apiP.CrearPersona(json).subscribe(data6 => {
          let response6: any = this.api.ProcesarRespuesta(data6);
          if (response6.tipo == 0) {
            this.buscarPersona(datos.Identificacion);
            this.Utilidades.ObtenerListas(SG_GRADOS);
            var grados = localStorage.getItem("SG_GRADOS");
            setTimeout(() => {
              if (grados != null) {
                this.model.gradosList = JSON.parse(grados);
              }
              Swal.close();
            }, 2000);
          }
        })
      }, 4000);
    })
  }

  closeT() {
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

  imagenCargadaMap: { [key: string]: string } = {};

  editar(datos: any) {
    this.model.isCrear = false;
    this.model.varTarjeta = datos;
    this.model.tarjeta = true;
    this.model.isLectura = false;
    this.apiT.ObtenerTarjetas({ id: datos.persona_id }).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        response.result.forEach((x: any) => {
          let lista = this.model.tiposList;
          x.Nuevoregistro = false;
          x.url_acta = this.api.acta_folder + x.ruta_acta;
          x.url_reserva = this.api.reserva_folder + x.ruta_reserva;
          x.ff = new Date(x.fecha_fin);
          if (Date.parse(x.ff) < Date.parse(this.model.d)) {
            x.des = 1;
          } else {
            x.des = 0;
          }
          let encontrar = lista.filter((y: any) => y.lista_dinamica_id == x.tipo_id);
          if (encontrar[0].atributo2 == 'temporal') {
            x.isTemporal = true;
          } else {
            x.isTemporal = false;
          }
        });

        this.model.listTarjetas = response.result;
        console.log(response.result);
      }
    })
    if (datos.existe_img == 1) {
      let foto = this.api.imagen_folder + datos.imagen;
      this.loadImage(this.ctx, foto);
    }
    else {
      this.loadImage(this.ctx, this.model.filename);
    }
    this.apiT.ObtenerNombreFoto({ identificacion: this.model.varTarjeta.numero_identificacion }).subscribe(
      (data: any) => {
        try {
          if (data.nombrefoto) {
            this.nombrefoto = data.nombrefoto;
            console.log("Nombre de la foto:", this.nombrefoto);
            if (this.nombrefoto) {
              let url = this.api.URL;
              // Construye la ruta completa a la imagen en la carpeta assets/images
              const rutaBase = `http://localhost:3000/fotos`;
              this.rutaImagen = `${rutaBase}/${this.nombrefoto}`;
              console.log(url);
              const img = new Image();
              img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
                this.ctx.drawImage(img, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
              };
              img.src = this.rutaImagen;

              // Usa this.model.varTarjeta.numero_identificacion como clave en el diccionario
              this.imagenCargadaMap[this.model.varTarjeta.numero_identificacion] = this.rutaImagen;

              console.log(this.rutaImagen);

            }
          } else {
            console.error("La respuesta no contiene el nombre de la foto.");
          }
        } catch (error) {
          console.error("Error al procesar la respuesta:", error);
        }
      },
      (error) => {
        console.error("Error en la solicitud HTTP:", error);
      }
    );
  }

  detalle(datos: any) {
    this.model.isCrear = false;
    this.model.varTarjeta = datos;
    this.model.tarjeta = true;
    this.model.isLectura = true;
    this.apiT.ObtenerTarjetas({ id: datos.persona_id }).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        response.result.forEach((x: any) => {
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
    this.apiT.ObtenerNombreFoto({ identificacion: this.model.varTarjeta.numero_identificacion }).subscribe(
      (data: any) => {
        try {
          if (data.nombrefoto) {
            this.nombrefoto = data.nombrefoto;
            console.log("Nombre de la foto:", this.nombrefoto);
            if (this.nombrefoto) {
              let url = this.api.URL;
              // Construye la ruta completa a la imagen en la carpeta assets/images
              const rutaBase = `http://localhost:3000/fotos`;
              this.rutaImagen = `${rutaBase}/${this.nombrefoto}`;
              console.log(url);
              const img = new Image();
              img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
                this.ctx.drawImage(img, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
              };
              img.src = this.rutaImagen;

              // Usa this.model.varTarjeta.numero_identificacion como clave en el diccionario
              this.imagenCargadaMap[this.model.varTarjeta.numero_identificacion] = this.rutaImagen;

              console.log(this.rutaImagen);

            }
          } else {
            console.error("La respuesta no contiene el nombre de la foto.");
          }
        } catch (error) {
          console.error("Error al procesar la respuesta:", error);
        }
      },
      (error) => {
        console.error("Error en la solicitud HTTP:", error);
      }
    );
  }

  add() {
    this.model.listTarjetas.push({
      tipo_id: 0,
      clasificacion_id: 0,
      vigencia: "",
      fecha_inicio: this.Utilidades.parseFecha(new Date(), false, 4),
      fecha_fin: "",
      unidad: this.model.varTarjeta.nombre_unidad,
      dependencia: this.model.varTarjeta.nombre_dependencia,
      cargo: this.model.varTarjeta.cargo,
      gr_nombre: "",
      gr_cargo: "",
      activo: true,
      Nuevoregistro: true,
      isTemporal: false
    });
  }

  delete(index: number) {
    this.model.listTarjetas.splice(index, 1);
  }

  guardar() {
    let respuesta = this.validaciones.validarTarjeta(this.model);
    if (respuesta.error == false) {
      for (let c = 0; c < this.model.listTarjetas.length; c = c + 1) {
        let d = this.model.listTarjetas.length - 1;
        let ultimo = this.model.listTarjetas[d];
        if (c != d) {
          if (this.model.listTarjetas[c].activo == true && this.model.listTarjetas[c].Nuevoregistro == false) {
            debugger
            let f_i = new Date(this.model.listTarjetas[c].fecha_inicio);
            let f_f = new Date(this.model.listTarjetas[c].fecha_fin);
            let f = new Date(ultimo.fecha_inicio);
            if (f >= f_i && f < f_f) {
              this.model.listTarjetas[c].activo = false;
            }
          }
        }
      }
      this.model.listTarjetas.forEach((x: any) => {
        x.persona_id = this.model.varTarjeta.persona_id;
        x.usuario = this.Utilidades.UsuarioConectado();
        x.restringe_da = this.model.varTarjeta.restringe_da;
        var datos: any = new FormData();
        datos.append('modelo', JSON.stringify(x));
        datos.append('acta', x.acta);
        datos.append('reserva', x.reserva);
        if (x.Nuevoregistro == true) {
          this.apiT.crearTarjeta(datos).subscribe(data => { });
        } else {
          this.apiT.actualizarTarjetas(datos).subscribe(data => { });
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
    } else {
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

  changefileActa(data: any, index: any) {
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + '-' + hoy.getMinutes() + '-' + hoy.getSeconds();
    var fechaYHora = fecha + hora;

    this.model.listTarjetas[index].acta = data.target.files[0];
    this.model.listTarjetas[index].acta_nombre = 'acta' + this.model.varTarjeta.numero_identificacion + fechaYHora;
    Swal.fire({
      title: "Tarjetas",
      text: "Archivo Cargado con Exito",
      icon: "success"
    });
  }

  changefileReserva(data: any, index: any, tarjeta: any) {
    var hoy = new Date();
    var fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear();
    var hora = hoy.getHours() + '-' + hoy.getMinutes() + '-' + hoy.getSeconds();
    var fechaYHora = fecha + hora;

    this.model.listTarjetas[index].reserva = data.target.files[0];
    this.model.listTarjetas[index].reserva_nombre = 'reserva' + this.model.varTarjeta.numero_identificacion + fechaYHora;
    Swal.fire({
      title: "Tarjetas",
      text: "Archivo Cargado con Exito",
      icon: "success"
    });
  }

  descargarDoc(URL: String, PDFName: String, num: number) {
    let nombre = "";
    if (num == 1) {
      nombre = "Acta " + PDFName;
    } else {
      nombre = "Reserva " + PDFName;
    }
    FileSaver.saveAs(URL, nombre);
  }

  vigencia(index: number, id: number) {
    this.changeTipo(this.model.listTarjetas[index].tipo_id, index);
    if (this.model.listTarjetas[index].isTemporal == false) {
      let lista = this.model.clasificacionList.filter((x: any) => x.lista_dinamica_id == id);
      this.model.listTarjetas[index].vigencia = lista[0].atributo1;

      const fechaInicial = new Date(this.model.listTarjetas[index].fecha_inicio); // Aquí puedes poner la fecha inicial que desees

      const diasASumar = this.model.listTarjetas[index].vigencia; // Aquí puedes poner el número de días que deseas sumar

      const fechaFinal = new Date(fechaInicial.getTime() + diasASumar * 24 * 60 * 60 * 1000);

      const año = fechaFinal.getFullYear();
      const mes = fechaFinal.getMonth() + 1;
      const día = fechaFinal.getDate();

      this.model.listTarjetas[index].fecha_fin = `${año}-${mes.toString().padStart(2, '0')}-${día.toString().padStart(2, '0')}`;
    }
  }

  changefechaInicio(index: number) {
    const fechaInicial = new Date(this.model.listTarjetas[index].fecha_inicio); // Aquí puedes poner la fecha inicial que desees

    const diasASumar = this.model.listTarjetas[index].vigencia; // Aquí puedes poner el número de días que deseas sumar

    const fechaFinal = new Date(fechaInicial.getTime() + diasASumar * 24 * 60 * 60 * 1000);

    const año = fechaFinal.getFullYear();
    const mes = fechaFinal.getMonth() + 1;
    const día = fechaFinal.getDate();

    this.model.listTarjetas[index].fecha_fin = `${año}-${mes.toString().padStart(2, '0')}-${día.toString().padStart(2, '0')}`;
  }

  imprimirCard(data: any) {
    this.model.title = "Tarjeta";
    this.model.iframe = true;
    let ruta = 'tarjetas/imprimirCard/{0}';
    let Apiurl = this.api.URL;
    this.model.Url_Tarjeta = Apiurl + ruta.replace("{0}", data.tarjeta_id);
    this.url = this.sanitizer.bypassSecurityTrustHtml(this.url.replace("{0}", this.model.Url_Tarjeta + "#zoom=100&toolbar=0"));
    this.model.link = Apiurl + "tarjetas/download/" + data.tarjeta_id;
  }

  closeIframe() {
    this.model.iframe = false;
    this.model.link = new Model().link;
    this.model.Url_Tarjeta = new Model().Url_Tarjeta;
    this.url = "<iframe src=\"{0}\" width=\"100%\" height=\"500\"><iframe>";
  }

  changeTipo(id: number, index: number) {
    let lista = this.model.tiposList;
    let encontrar = lista.filter((x: any) => x.lista_dinamica_id == id);
    let isTemporal: boolean = false;
    if (encontrar[0].atributo2 == 'temporal') {
      isTemporal = true;
      this.model.listTarjetas[index].fecha_inicio = "";
    } else {
      isTemporal = false;
      this.model.listTarjetas[index].fecha_inicio = this.Utilidades.parseFecha(new Date(), false, 4);
    }
    this.model.listTarjetas[index].isTemporal = isTemporal;
  }

  nombrefoto!: string;

  numeroIdentificacion!: string;
  fotoUrl!: string;


  obtenerNombreDeFoto(numeroIdentificacion: string) {
    // Construye la URL con el número de identificación
    const url = `http://localhost:8000/api/tarjetas/buscarImagen/identificacion:${this.model.varTarjeta.numero_identificacion}`;

    // Realiza la solicitud HTTP
    this.http.get(url)
      .subscribe((response: any) => {
        // Comprueba si la respuesta contiene el nombre de la foto
        if (response.result && response.result[0] && response.result[0].nombrefoto) {
          // Extrae el nombre de la foto de la respuesta
          this.nombrefoto = response.result[0].nombrefoto;
        } else {
          console.error('No se encontró el nombre de la foto para la cédula proporcionada.');
        }
      }, error => {
        console.error('Error al obtener el nombre de la foto', error);
      });
  }
  rutaImagen!: string;

  buscarFoto() {
    this.apiT.ObtenerNombreFoto({ identificacion: this.model.varTarjeta.numero_identificacion }).subscribe(
      (data: any) => {
        try {
          if (data.nombrefoto) {
            this.nombrefoto = data.nombrefoto;
            console.log("Nombre de la foto:", this.nombrefoto);
            if (this.nombrefoto) {
              this.cargarFoto();
            }
          } else {
            console.error("La respuesta no contiene el nombre de la foto.");
          }
        } catch (error) {
          console.error("Error al procesar la respuesta:", error);
        }
      },
      (error) => {
        console.error("Error en la solicitud HTTP:", error);
      }
    );
  }


  showError: boolean = false;
  errorMessage: string = '';

  cargarFoto() {
    Swal.fire({
      title: 'Cargando Foto...',
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
    Swal.showLoading();
    if (this.nombrefoto) {
      let url = this.api.URL;
      // Construye la ruta completa a la imagen en la carpeta assets/images
      const rutaBase = `http://localhost:3000/fotos`;
      this.rutaImagen = `${rutaBase}/${this.nombrefoto}`;
      console.log(url);
      const img = new Image();
      img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        this.ctx.drawImage(img, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        setTimeout(() => {
          Swal.close();
        }, 2000); // 3000 milisegundos (3 segundos) en este ejemplo
      };
      img.onerror = () => {
        // Si la imagen no se carga correctamente, muestra un mensaje de error y carga la imagen de avatar.
        Swal.fire({
          title: 'Error',
          text: 'La foto no pudo ser encontrada',
          icon: 'error',
          allowOutsideClick: false,
          showCancelButton: false,
          showConfirmButton: true,
        });
        this.showError = true;
        console.log('La foto no se encuentra en la URL especificada');
        // Cargar la imagen de avatar en lugar de la imagen faltante
        this.rutaImagen = "../../../assets/images/avatar.jpg";
        const avatarImg = new Image();
        avatarImg.onload = () => {
          this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
          this.ctx.drawImage(avatarImg, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
        };
        avatarImg.src = this.rutaImagen;
      };
      img.src = this.rutaImagen;
      // Usa this.model.varTarjeta.numero_identificacion como clave en el diccionario
      this.imagenCargadaMap[this.model.varTarjeta.numero_identificacion] = this.rutaImagen;
      console.log(this.rutaImagen);

    } else {
      Swal.fire({
        title: 'Error',
        text: 'El nombre de la foto no fue',
        icon: 'error',
        allowOutsideClick: false,
        showCancelButton: false,
        showConfirmButton: true,
      });
      Swal.showLoading();
      this.showError = true;
      console.log('La foto no se encuentra en la unidad Z');

    }
  }

  closeError() {
    this.showError = false;
  }





}
