import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Entitys } from '../entitys';
import { ApiService } from '../services/api.service';
import { Model } from './entidades';
import { LoginService } from '../services/auth/login.service';

declare var Swal:any;
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  password: string = "";
  showPassword: boolean = false;
  //Entidades
  model = new Model();
  entity =new Entitys();
  constructor(private router : Router,private login: LoginService , private api: ApiService) {
    localStorage.clear();
  }

  ngOnInit() {
    localStorage.setItem("llave","0");//importante inicializa la llave en 0
  }

  logeo(){
    this.model.showLoading = true;
    this.login.login({ usuario: this.model.varLogin.user, password: this.model.varLogin.pass }).subscribe(data => {
      let response: any = this.api.ProcesarRespuesta(data);
      if (response.tipo === 0) {
        localStorage.setItem("currentUser", JSON.stringify(response.user.result));
        localStorage.setItem("llave","1");
        localStorage.setItem("cargarListas","1");
        setTimeout(() => {
          location.href = "/fac/home";
        }, 1000);
      }
      else {
        Swal.fire({
          title: 'ERROR',
          text: response.mensaje,
          allowOutsideClick: false,
          showConfirmButton: true,
          icon: 'error'
        }).then((result: any) => {
          if (result) {
            this.model.varLogin.pass = "";
            window.location.href = '/';
          }
        });
      }
    });
  }

  inputNext() {
    $('.inputp').focus();
  }
}
