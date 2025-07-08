// src/app/api/usuario.service.ts - NUEVO
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/users`);
  }

  // Crear nuevo usuario
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/users`, usuario);
  }

  // Buscar usuario por ultimatix
  buscarPorUltimatix(ultimatix: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/users?user_ultimatix=${ultimatix}`);
  }

  // Validar login
  validarLogin(ultimatix: string, password: string, rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/users?user_ultimatix=${ultimatix}&user_password=${password}&role=${rol}`);
  }
}