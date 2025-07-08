import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../api/usuario.service';
import { Usuario } from '../../modelos/usuario.model';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  // Datos del formulario
  ultimatix = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  rol = '';
  country = '';
  city = '';
  
  error = '';
  success = '';
  cargando = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  registro() {
    // Validaciones básicas
    if (!this.ultimatix || !this.password || !this.confirmPassword || 
        !this.firstName || !this.lastName || !this.email || 
        !this.phone || !this.rol || !this.country || !this.city) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.ultimatix.length < 7) {
      this.error = 'El Ultimatix debe tener al menos 7 caracteres';
      return;
    }

    this.cargando = true;
    this.error = '';

    // Verificar si el ultimatix ya existe
    this.usuarioService.buscarPorUltimatix(this.ultimatix).subscribe({
      next: (usuariosExistentes) => {
        if (usuariosExistentes.length > 0) {
          this.error = 'El Ultimatix ya está registrado';
          this.cargando = false;
          return;
        }

        // Crear nuevo usuario con el formato de tu JSON
        const nuevoUsuario: Usuario = {
          id: this.generarId(),
          user_id: this.generarUserId(),
          user_gender: 'not_specified', // Podrías agregar un campo para esto
          role: this.rol,
          user_name: {
            first_name: this.firstName,
            last_name: this.lastName
          },
          user_location: {
            country: this.country,
            city: this.city
          },
          user_email: this.email,
          user_ultimatix: this.ultimatix,
          user_password: this.password,
          user_phone: this.phone,
          user_picture: {
            url: `https://randomuser.me/api/portraits/${this.rol === 'analyst' ? 'women' : 'men'}/${Math.floor(Math.random() * 99)}.jpg`
          }
        };

        // Guardar en JSON Server
        this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
          next: (usuarioCreado) => {
            this.success = 'Usuario registrado exitosamente. Redirigiendo al login...';
            this.error = '';
            this.cargando = false;

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/iniciar-sesion']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            this.error = 'Error al registrar usuario. Intenta nuevamente.';
            this.cargando = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al verificar usuario:', error);
        this.error = 'Error de conexión. Intenta nuevamente.';
        this.cargando = false;
      }
    });
  }

  private generarId(): string {
    return Math.random().toString(36).substr(2, 4);
  }

  private generarUserId(): number {
    return Math.floor(Math.random() * 900000) + 100000; // 6 dígitos
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  irALogin(): void {
    this.router.navigate(['/iniciar-sesion']);
  }
}
