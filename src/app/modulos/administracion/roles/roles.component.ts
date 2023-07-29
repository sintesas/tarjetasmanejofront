import { Component } from '@angular/core';
import { Model } from './entidades';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/services/admin/roles/roles.service';
import { UtilidadesService } from 'src/app/services/utilidades/utilidades.service';
import { UsuariosService } from 'src/app/services/admin/usuarios/usuarios.service';


declare var Swal:any;

export class Permiso {
  consultar: any;
  crear: any;
  actualizar: any;
  eliminar: any;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  model = new Model();
  p = new Permiso();

  constructor(private api:ApiService, private router:Router, private apiR:RolesService, private utilidades:UtilidadesService, private usuarioService: UsuariosService){}

  ngOnInit(): void {
    this.getRoles();
    this.getModulos();
    this.getPermisos();
  }

  reload() {
    this.ngOnInit();
    // let currentUrl = this.router.url;
    // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    //   this.router.navigate([currentUrl]);
    // });
  }

  search(e: any) {
    let filtro: string = e.target.value.trim().toLowerCase();
    if (filtro.length == 0) {
      this.model.varhistorial = this.model.varhistorialTemp;
    }
    else {
      this.model.varhistorial = this.model.varhistorialTemp.filter((item: any) => {
        if (item.rol.toString().toLowerCase().indexOf(filtro) !== -1 ||
            item.descripcion.toString().toLowerCase().indexOf(filtro) !== -1 ) {
            return true;
        }
        return false;
      });
    }
  }

  clearSearch(e: any) {
    if (e.target.value == "") {
      this.model.varhistorial = this.model.varhistorialTemp;
    }
  }

  searchPrivilegio(e: any) {
    let filtro: string = e.target.value.trim().toLowerCase();
    if (filtro.length == 0) {
      this.model.varprivilegio = this.model.varprivilegioTemp;
    }
    else {
      this.model.varprivilegio = this.model.varprivilegioTemp.filter((item: any) => {
        if (item.nombre_pantalla.toString().toLowerCase().indexOf(filtro) !== -1) {
            return true;
        }
        return false;
      });
    }
  }

  clearSearchPrivilegio(e: any) {
    if (e.target.value == "") {
      this.model.varprivilegio = this.model.varprivilegioTemp;
    }
  }

  getPermisos() {
    let dato = this.utilidades.DatosUsuario();
    let json = {
      usuario: dato.usuario,
      cod_modulo: 'AD'
    }

    this.usuarioService.getPermisos(json).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        this.p.consultar = response.result.consultar;
        this.p.crear = response.result.crear;
        this.p.actualizar = response.result.actualizar;
        this.p.eliminar = response.result.eliminar;
      }
    })
  }

  getRoles() {
    this.apiR.getRoles().subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      // setTimeout(() => {
      //   this.loading = false;
      // }, 1000);
      if (response.tipo == 0) {
        response.result.forEach((x:any) => {
          if(x.descripcion == null){
            x.descripcion = "";
          }
        });
        this.model.varhistorial = response.result;
        this.model.varhistorialTemp = response.result;
      }
    });
  }

  getModulos() {
    this.apiR.getModulos().subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        response.result.forEach((x: any) => {
          x.descripcion = x.modulo;
          x.sigla = x.pantalla;
        });
        this.model.varmodulo = response.result;
      }
    });
  }

  openModal() {
    this.model.modal = true;
    this.model.title = 'Crear Rol';
    this.model.isCreacion = true;
    this.model.varRol = new Model().varRol;
  }

  closeModal(bol: any) {
    this.model.modal = bol;
  }

  editRoles(data: any) {
    this.model.modal = true;
    this.model.title = 'Actualizar Rol';
    this.model.isCreacion = false;

    this.model.varRol.rol_id = data.rol_id;
    this.model.varRol.rol = data.rol;
    this.model.varRol.descripcion = data.descripcion;
    this.model.varRol.activo = (data.activo == 'S') ? true : false;
  }

  saveRoles() {
    if(this.model.varRol.rol == null || this.model.varRol.rol == undefined || this.model.varRol.rol == ""){
      Swal.fire({
        title: "Error",
        text: "LLene el campo Rol",
        icon: "warning"
      });
    }else{
      this.model.varRol.rol = this.model.varRol.rol.toUpperCase();
      this.apiR.createRol(this.model.varRol).subscribe(data => {
        let response: any = this.api.ProcesarRespuesta(data);
        if (response.tipo == 0) {
          Swal.fire({
            title: 'Roles',
            text: response.mensaje,
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            icon: 'success'
          }).then((result: any) => {
            this.model.modal = false;
            this.reload();
          })
        }
      });
    }
  }

  updateRoles() {
    this.model.varRol.rol = this.model.varRol.rol.toUpperCase();
    this.apiR.updateRol(this.model.varRol).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        Swal.fire({
          title: 'Roles',
          text: response.mensaje,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          icon: 'success'
        }).then((result: any) => {
          this.model.modal = false;
          this.openRolPrivilegiosById(this.model.varRol.rol_id);
          this.reload();
        });
      }
    });
  }

  openRolPrivilegiosById(id: any) {
    this.apiR.getRolPrivilegiosById({ rol_id: id }).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo == 0) {
        response.result.forEach((x: any) => {
          x.NuevoRegistro = false;
          x.consultar = (x.consultar == 1) ? true : false;
          x.crear = (x.crear == 1) ? true : false;
          x.actualizar = (x.actualizar == 1) ? true : false;
          x.eliminar = (x.eliminar == 1) ? true : false;
          x.activo = (x.activo == 1) ? true : false;
          x.EliminarRegistro = true;
        });
        this.model.varprivilegio = response.result;
        this.model.varprivilegioTemp = response.result;
      }
    });
  }

  openRolPrivilegios(dato: any) {
    this.model.rolPrivilegioModal = true;
    this.model.title = "Roles Privilegios - " + dato.rol;

    this.model.rol_id = dato.rol_id;

    this.model.varRolPrivilegio.rol_id = this.model.rol_id;

    this.openRolPrivilegiosById(this.model.rol_id);
  }

  closeSelectModal(bol: any) {
    this.model.selectModal = false;
  }

  saveModulo(index: number) {
    this.model.varmodulo.forEach((x:any) => {
      x.item1 = x.modulo;
      x.item2 = x.pantalla;
    });
    this.model.cabezeras = [];
    this.model.cabezeras.push({
      title1: "Modulos",
      title2: "Pantallas"
    })
    this.model.array = this.model.varmodulo;
    this.model.inputform = 'modulo';
    this.model.index = index;
    this.model.selectModal = true;
  }

  addPrivilegio() {
    this.model.varprivilegio.push({
      rol_privilegio_id:0,
      rol_id:0,
      num_pantalla:0,
      modulo:"",
      nombre_pantalla:"",
      consultar:false,
      crear:false,
      actualizar:false,
      eliminar:false,
      activo:true,
      usuario_creador:this.utilidades.UsuarioConectado(),
      usuario_modificador:this.utilidades.UsuarioConectado(),
      NuevoRegistro:true,
      EliminarRegistro:false});
  }

  deletePrivilegio(index: any) {
    this.model.varprivilegio.splice(index, 1);
  }

  closeRolPrivilegioModal(bol: any) {
    this.model.rolPrivilegioModal = false;
  }

  eliminarRegistro(data: any, index: any) {
    Swal.fire({
      title: 'Roles Privilegios',
      text: "¿Está seguro que desea eliminar el registro?",
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: "#ed1c24",
      icon: 'question'
    }).then(((result: any) => {
      if (result.dismiss != "cancel") {
        let json = {
          rol_privilegio_id: data.rol_privilegio_id
        }
        this.apiR.deleteRolPrivilegiosById(json).subscribe((data:any) => {
          let response: any = this.api.ProcesarRespuesta(data);
          if (response.tipo == 0) {
            this.model.varprivilegio.splice(index, 1);
          }
        });
      }
    }));
  }

  savePrivilegios() {
    if (this.model.varprivilegio.length > 0) {
      this.model.varprivilegio.forEach((x: any) => {
        x.rol_id = this.model.rol_id;
        x.usuario = this.utilidades.UsuarioConectado();
        if (x.NuevoRegistro == true) {
          this.apiR.createRolPrivilegios(x).subscribe(data => {
            this.api.ProcesarRespuesta(data);
          });
        }
        else {
          this.apiR.updateRolPrivilegios(x).subscribe(data => {
            this.api.ProcesarRespuesta(data);
          });
        }

        Swal.fire({
          title: 'Roles Privilegios',
          text: 'El rol privilegio fue guardado con éxito.',
          allowOutsideClick: false,
          showConfirmButton: true,
          icon: 'success'
        }).then((result: any) => {
          this.model.rolPrivilegioModal = false;
          this.openRolPrivilegiosById(this.model.varRolPrivilegio.rol_id);
          this.reload();
        });
      });
    }
  }

  dataform(inputform: any, data: any) {
    this.model.selectModal = false;
    if (inputform == 'modulo') {
      this.model.varprivilegio[this.model.index].num_pantalla = data.menu_id;
      this.model.varprivilegio[this.model.index].modulo = data.descripcion;
      this.model.varprivilegio[this.model.index].nombre_pantalla = data.sigla;

      if (data.menu_id == null) {
        this.model.varprivilegio[this.model.index].consultar = true;
        this.model.varprivilegio[this.model.index].crear = true;
        this.model.varprivilegio[this.model.index].actualizar = true;
        this.model.varprivilegio[this.model.index].eliminar = true;
      }
    }
  }
}
