import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { GerenteComponent } from './paginas/gerente/gerente.component';
import { AnalistaComponent } from './paginas/analista/analista.component';

const routes: Routes = [
  { 
    path: '', redirectTo: 'inicio', pathMatch: 'full' 
  },
  { 
    path: 'inicio', component: InicioComponent 
  },
  { 
    path: 'iniciar-sesion', component: LoginComponent 
  },
  { 
    path: 'registro', component: RegistroComponent 
  },
  // AGREGAR ESTAS RUTAS QUE FALTABAN:
  { 
    path: 'analista', component: AnalistaComponent 
  },
  { 
    path: 'gerente', component: GerenteComponent 
  },
  // Ruta wildcard al final
  { 
    path: '**', redirectTo: 'inicio' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
