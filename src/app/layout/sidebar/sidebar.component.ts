import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  currentUser: any;
  allMenu:any = [];
  usuario:any = {
    usuario: ""
  };

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") as any);
    let user = this.currentUser.usuario;
    this.usuario.usuario = user.toUpperCase();
    let menus = this.currentUser.menus;
    this.allMenu = menus;
  }

  ngOnInit(): void {
  }
}
