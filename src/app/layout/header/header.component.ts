import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SesionService } from 'src/app/services/sesion/sesion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
   
  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter();

  currentUser: any;
  showMenu = false;

  constructor(private Sesion:SesionService){}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser") as any);
  }

  toggle() {
    this.toggleSideBar.emit();
  }

  logout() {
    this.Sesion.logout(1);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
