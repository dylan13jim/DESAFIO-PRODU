// src/app/componentes/encabezado/encabezado.component.ts - CORREGIDO
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-encabezado',
  standalone: false, 
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit, OnDestroy {
  usuario: any = null;
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verificar usuario al iniciar
    this.verificarUsuario();
    
    // Escuchar cambios de ruta para actualizar el usuario
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.verificarUsuario();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  verificarUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    if (usuarioGuardado) {
      try {
        this.usuario = JSON.parse(usuarioGuardado);
        console.log('Usuario actual:', this.usuario); // Para debug
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        this.usuario = null;
        localStorage.removeItem('usuario_actual');
      }
    } else {
      this.usuario = null;
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario_actual');
    this.usuario = null;
    this.router.navigate(['/inicio']);
  }

  irADashboard(): void {
    if (this.usuario) {
      // Verificar ambas propiedades de rol
      const rol = this.usuario.rol || this.usuario.role;
      console.log('Rol detectado:', rol); // Para debug
      
      if (rol === 'analyst') {
        this.router.navigate(['/analista']);
      } else if (rol === 'manager') {
        this.router.navigate(['/gerente']);
      } else {
        console.error('Rol no reconocido:', rol);
        this.router.navigate(['/inicio']);
      }
    }
  }

  obtenerNombreCompleto(): string {
    if (this.usuario) {
      // Verificar diferentes formatos de nombre
      if (this.usuario.nombre) {
        return this.usuario.nombre;
      } else if (this.usuario.user_name) {
        return `${this.usuario.user_name.first_name} ${this.usuario.user_name.last_name}`;
      } else if (this.usuario.firstName && this.usuario.lastName) {
        return `${this.usuario.firstName} ${this.usuario.lastName}`;
      }
      return 'Usuario';
    }
    return '';
  }

  obtenerDescripcionRol(): string {
    if (this.usuario) {
      // Verificar ambas propiedades de rol
      const rol = this.usuario.rol || this.usuario.role;
      console.log('Mostrando rol:', rol); // Para debug
      
      switch (rol) {
        case 'analyst':
          return 'Analista de Mercado';
        case 'manager':
          return 'Gerente de Ventas';
        default:
          return rol || 'Usuario';
      }
    }
    return '';
  }
}