import { Component } from '@angular/core';
import { SesionService } from '../services/sesion/sesion.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent {
  
  sideBarOpen = true;
  modal: boolean = false;
  timeoutId:any;
  
  constructor(private sesion: SesionService){}
  
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  ngOnInit() {
    this.resetTimer();
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('mousedown', this.resetTimer.bind(this));
    window.addEventListener('keypress', this.resetTimer.bind(this));
    window.addEventListener('touchmove', this.resetTimer.bind(this));
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  resetTimer() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.sesion.logout();
    }, 600000); //600000 10 minutos de inactividad antes de cerrar sesión
  }

  clearTimer() {
    clearTimeout(this.timeoutId);
  }
}
