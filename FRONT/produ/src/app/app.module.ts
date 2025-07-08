import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { AnalistaComponent } from './paginas/analista/analista.component';
import { GerenteComponent } from './paginas/gerente/gerente.component';
import { EncabezadoComponent } from './componentes/encabezado/encabezado.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from './api/usuario.service';
import { ProductoService } from './api/producto.service';
import { AutenticacionService } from './api/autenticacion.service';
import { RolService } from './api/rol.service';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    RegistroComponent,
    AnalistaComponent,
    GerenteComponent,
    EncabezadoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule, 
  ],
  providers: [UsuarioService, ProductoService, AutenticacionService, RolService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
