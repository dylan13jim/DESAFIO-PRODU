// src/app/api/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { Usuario } from '../modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private apiURL = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  iniciarSesion(ultimatix: string, contrasena: string, rol: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiURL}?user_ultimatix=${ultimatix}&user_password=${contrasena}&role=${rol}`)
      .pipe(
        map(usuarios => usuarios.length ? usuarios[0] : null)
      );
  }

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiURL, usuario);
  }
}
