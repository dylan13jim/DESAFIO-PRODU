// src/app/modelos/usuario.model.ts - CORREGIDO
export interface NombreUsuario {
    first_name: string;
    last_name: string;
  }
  
  export interface UbicacionUsuario {
    country: string;
    city: string;
  }
  
  export interface ImagenUsuario {
    url: string;
  }
  
  export interface Usuario {
    id: string;
    user_id: number;
    user_gender: string; // ← Cambiado a string para aceptar cualquier valor
    role: string;
    user_name: NombreUsuario;
    user_location: UbicacionUsuario;
    user_email: string;
    user_ultimatix: string;
    user_password: string;
    user_phone: string;
    user_picture: ImagenUsuario;
  }