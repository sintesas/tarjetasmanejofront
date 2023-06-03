import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Entitys } from '../entitys';
import { AccesoGuard } from '../guards/acceso.guard';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../modulos/home/home.component';
import { MenuComponent } from '../modulos/menu/menu.component';
import { NotfoundComponent } from '../modulos/notfound/notfound.component';
import { PlatformComponent } from './platform.component';
import { UsuariosComponent } from '../modulos/administracion/usuarios/usuarios.component';
import { RolesComponent } from '../modulos/administracion/roles/roles.component';
import { ListasComponent } from '../modulos/parametrizacion/listas/listas.component';
import { PersonasComponent } from '../modulos/parametrizacion/personas/personas.component';
import { UnidadesComponent } from '../modulos/parametrizacion/unidades/unidades.component';
import { TarjetasComponent } from '../modulos/tarjetas/tarjetas.component';

var entidad = new Entitys();
var ruta = String(entidad.ruta);

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'fac', component: PlatformComponent, children:[
    { path: 'home', component: HomeComponent, canActivate: [AccesoGuard]},
    { path: 'menu', component: MenuComponent, canActivate: [AccesoGuard]},
    { path: 'admin/usuarios', component: UsuariosComponent, canActivate: [AccesoGuard]},
    { path: 'admin/roles', component: RolesComponent, canActivate: [AccesoGuard]},
    { path: 'param/personas', component: PersonasComponent, canActivate: [AccesoGuard]},
    { path: 'param/unidades', component: UnidadesComponent, canActivate: [AccesoGuard]},
    { path: 'param/listas', component: ListasComponent, canActivate: [AccesoGuard]},
    { path: 'tarjetas', component: TarjetasComponent, canActivate: [AccesoGuard]},
    { path: '404', component: NotfoundComponent, canActivate: [AccesoGuard]},
    { path: '**', redirectTo: ruta}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatformRoutingModule { }
