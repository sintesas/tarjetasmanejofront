import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { PlatformRoutingModule } from './platform-routing.module';
import { PlatformComponent } from './platform.component';
import { MenuComponent } from '../modulos/menu/menu.component';
import { HomeComponent } from '../modulos/home/home.component';
import { NotfoundComponent } from '../modulos/notfound/notfound.component';
import { LoginComponent } from '../login/login.component';
import { HeaderComponent } from '../layout/header/header.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { TreeviewComponent } from '../layout/treeview/treeview.component';
import { ModalComponent } from '../views/modal/modal.component';
import { BreadcrumbComponent } from '../views/breadcrumb/breadcrumb.component';
import { UsuariosComponent } from '../modulos/administracion/usuarios/usuarios.component';
import { RolesComponent } from '../modulos/administracion/roles/roles.component';
import { SelectModalComponent } from '../views/select-modal/select-modal.component';
import { ListasComponent } from '../modulos/parametrizacion/listas/listas.component';
import { SelectRolModalComponent } from '../views/select-rol-modal/select-rol-modal.component';
import { PersonasComponent } from '../modulos/parametrizacion/personas/personas.component';
import { UnidadesComponent } from '../modulos/parametrizacion/unidades/unidades.component';
import { TarjetasComponent } from '../modulos/tarjetas/tarjetas.component';


@NgModule({
  declarations: [
    PlatformComponent,
    MenuComponent,
    NotfoundComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    TreeviewComponent,
    ModalComponent,
    BreadcrumbComponent,
    UsuariosComponent,
    RolesComponent,
    SelectModalComponent,
    ListasComponent,
    SelectRolModalComponent,
    PersonasComponent,
    UnidadesComponent,
    TarjetasComponent
  ],
  imports: [
    CommonModule,
    PlatformRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class PlatformModule { }
