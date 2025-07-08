import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../modelos/producto.model';

interface Promocion {
  id: string;
  producto: Producto;
  cantidad_promocional: number;
  precio_promocional: number;
  descuento_porcentaje: number;
  creado_por: string;
  email_creador: string;
  fecha_creacion: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  comentarios?: string;
  fecha_revision?: string;
  revisado_por?: string;
}


@Component({
  selector: 'app-gerente',
  standalone: false,
  templateUrl: './gerente.component.html',
  styleUrl: './gerente.component.css'
})

export class GerenteComponent implements OnInit {
  usuario: any = null;
  promociones: Promocion[] = [];
  promocionesFiltradas: Promocion[] = [];
  filtroActual: string = 'pendiente';
  
  // Para el modal de comentarios
  promocionSeleccionada: Promocion | null = null;
  comentarios: string = '';
  mostrarModal: boolean = false;
  accionModal: 'aprobar' | 'rechazar' = 'aprobar';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarUsuario();
    this.cargarPromociones();
    this.filtrarPromociones();
  }

  verificarUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      if (this.usuario.rol !== 'manager') {
        this.router.navigate(['/inicio']);
      }
    } else {
      this.router.navigate(['/iniciar-sesion']);
    }
  }

  cargarPromociones(): void {
    // Obtener promociones del localStorage
    const promocionesGuardadas = localStorage.getItem('promociones');
    if (promocionesGuardadas) {
      this.promociones = JSON.parse(promocionesGuardadas);
    } else {
      // Promociones de ejemplo usando tu modelo de producto
      this.promociones = [
        {
          id: '1',
          producto: {
            id: '7aeb',
            product_id: 1,
            product_name: 'Laptop Asus ZenBook',
            product_list_price: 59.99,
            product_min_promo_quantity: 3,
            product_max_promo_quantity: 10,
            product_min_promo_price: 49.99
          },
          cantidad_promocional: 5,
          precio_promocional: 49.99,
          descuento_porcentaje: this.calcularDescuento(59.99, 49.99),
          creado_por: 'Ana Gomez',
          email_creador: 'ana.gomez@tcs.com',
          fecha_creacion: '2024-01-15',
          estado: 'pendiente'
        },
        {
          id: '2',
          producto: {
            id: '24f4',
            product_id: 2,
            product_name: 'Smartphone Samsung Galaxy',
            product_list_price: 29.99,
            product_min_promo_quantity: 2,
            product_max_promo_quantity: 5,
            product_min_promo_price: 24.99
          },
          cantidad_promocional: 3,
          precio_promocional: 24.99,
          descuento_porcentaje: this.calcularDescuento(29.99, 24.99),
          creado_por: 'Ana Gomez',
          email_creador: 'ana.gomez@tcs.com',
          fecha_creacion: '2024-01-14',
          estado: 'pendiente'
        },
        {
          id: '3',
          producto: {
            id: '9b3f',
            product_id: 3,
            product_name: 'Tablet Apple iPad',
            product_list_price: 39.99,
            product_min_promo_quantity: 2,
            product_max_promo_quantity: 5,
            product_min_promo_price: 34.99
          },
          cantidad_promocional: 4,
          precio_promocional: 34.99,
          descuento_porcentaje: this.calcularDescuento(39.99, 34.99),
          creado_por: 'Juan Martinez',
          email_creador: 'j.martinez@tcs.com',
          fecha_creacion: '2024-01-13',
          estado: 'aprobada',
          comentarios: 'Excelente promoción, dentro del rango permitido',
          fecha_revision: '2024-01-14',
          revisado_por: 'Carlos Lopez'
        }
      ];
      localStorage.setItem('promociones', JSON.stringify(this.promociones));
    }
  }

  calcularDescuento(precioOriginal: number, precioPromo: number): number {
    return Math.round(((precioOriginal - precioPromo) / precioOriginal) * 100);
  }

  filtrarPromociones(): void {
    this.promocionesFiltradas = this.promociones.filter(p => p.estado === this.filtroActual);
  }

  cambiarFiltro(filtro: string): void {
    this.filtroActual = filtro;
    this.filtrarPromociones();
  }

  abrirModal(promocion: Promocion, accion: 'aprobar' | 'rechazar'): void {
    this.promocionSeleccionada = promocion;
    this.accionModal = accion;
    this.comentarios = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.promocionSeleccionada = null;
    this.comentarios = '';
  }

  confirmarAccion(): void {
    if (!this.promocionSeleccionada) return;

    const index = this.promociones.findIndex(p => p.id === this.promocionSeleccionada!.id);
    if (index !== -1) {
      this.promociones[index].estado = this.accionModal === 'aprobar' ? 'aprobada' : 'rechazada';
      this.promociones[index].comentarios = this.comentarios;
      this.promociones[index].fecha_revision = new Date().toISOString().split('T')[0];
      this.promociones[index].revisado_por = this.usuario.nombre || `${this.usuario.firstName} ${this.usuario.lastName}`;
      
      // Guardar en localStorage
      localStorage.setItem('promociones', JSON.stringify(this.promociones));
      
      // Actualizar vista
      this.filtrarPromociones();
    }

    this.cerrarModal();
  }

  obtenerContadores() {
    return {
      pendientes: this.promociones.filter(p => p.estado === 'pendiente').length,
      aprobadas: this.promociones.filter(p => p.estado === 'aprobada').length,
      rechazadas: this.promociones.filter(p => p.estado === 'rechazada').length
    };
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  validarPromocion(promocion: Promocion): { esValida: boolean, mensaje: string } {
    const producto = promocion.producto;
    
    // Validar cantidad
    if (promocion.cantidad_promocional < producto.product_min_promo_quantity || 
        promocion.cantidad_promocional > producto.product_max_promo_quantity) {
      return {
        esValida: false,
        mensaje: `Cantidad fuera del rango permitido (${producto.product_min_promo_quantity}-${producto.product_max_promo_quantity})`
      };
    }
    
    // Validar precio mínimo
    if (promocion.precio_promocional < producto.product_min_promo_price) {
      return {
        esValida: false,
        mensaje: `Precio menor al mínimo permitido ($${producto.product_min_promo_price})`
      };
    }
    
    return { esValida: true, mensaje: 'Promoción válida' };
  }
}
