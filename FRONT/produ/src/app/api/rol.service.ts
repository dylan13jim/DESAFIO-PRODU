// src/app/api/rol.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../modelos/rol.model';


@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiURL = 'http://localhost:3000/roles';

  constructor(private http: HttpClient) {}

  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiURL);
  }
}
