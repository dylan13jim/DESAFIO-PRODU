// src/app/paginas/login/login.component.ts - CORREGIDO
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../api/usuario.service';

@Component({
  selector: 'app-login',
  standalone: false, 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  ultimatix = '';
  password = '';
  rol = '';
  error = '';
  cargando = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  login() {
    // Validación simple
    if (!this.ultimatix || !this.password || !this.rol) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }
  
    this.cargando = true;
    this.error = '';
  
    // Validar con JSON Server
    this.usuarioService.validarLogin(this.ultimatix, this.password, this.rol).subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          const usuario = usuarios[0];
          
          // Guardar en localStorage con estructura normalizada
          const usuarioParaGuardar = {
            ...usuario,
            // Normalizar el nombre
            nombre: `${usuario.user_name.first_name} ${usuario.user_name.last_name}`,
            // Asegurar que ambas propiedades de rol estén disponibles
            rol: usuario.role,
            role: usuario.role
          };
          
          localStorage.setItem('usuario_actual', JSON.stringify(usuarioParaGuardar));
          
          console.log('Usuario guardado:', usuarioParaGuardar); // Para debug
          
          // Redirigir según rol
          if (usuario.role === 'analyst') {
            this.router.navigate(['/analista']);
          } else if (usuario.role === 'manager') {
            this.router.navigate(['/gerente']);
          } else {
            this.router.navigate(['/inicio']);
          }
        } else {
          this.error = 'Credenciales incorrectas';
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.error = 'Error de conexión. Intenta nuevamente.';
        this.cargando = false;
      }
    });
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}