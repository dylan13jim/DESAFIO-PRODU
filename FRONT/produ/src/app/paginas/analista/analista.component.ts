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
  selector: 'app-analista',
  standalone: false,
  templateUrl: './analista.component.html',
  styleUrl: './analista.component.css'
})
export class AnalistaComponent implements OnInit {
  usuario: any = null;
  productos: Producto[] = [];
  promociones: Promocion[] = [];
  
  // Para el formulario de nueva promoción
  mostrarFormulario: boolean = false;
  productoSeleccionado: Producto | null = null;
  cantidadPromocional: number = 0;
  precioPromocional: number = 0;
  
  // Mensajes
  error: string = '';
  success: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarUsuario();
    this.cargarProductos();
    this.cargarPromociones();
  }

  verificarUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
      if (this.usuario.rol !== 'analyst') {
        this.router.navigate(['/inicio']);
      }
    } else {
      this.router.navigate(['/iniciar-sesion']);
    }
  }

  cargarProductos(): void {
    // Obtener productos del localStorage o usar datos de ejemplo
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      this.productos = JSON.parse(productosGuardados);
    } else {
      // Productos de ejemplo usando tu modelo
      this.productos = [
        {
          id: '7aeb',
          product_id: 1,
          product_name: 'Laptop Asus ZenBook',
          product_list_price: 59.99,
          product_min_promo_quantity: 3,
          product_max_promo_quantity: 10,
          product_min_promo_price: 49.99
        },
        {
          id: '24f4',
          product_id: 2,
          product_name: 'Smartphone Samsung Galaxy',
          product_list_price: 29.99,
          product_min_promo_quantity: 2,
          product_max_promo_quantity: 5,
          product_min_promo_price: 24.99
        },
        {
          id: '9b3f',
          product_id: 3,
          product_name: 'Tablet Apple iPad',
          product_list_price: 39.99,
          product_min_promo_quantity: 2,
          product_max_promo_quantity: 5,
          product_min_promo_price: 34.99
        },
        {
          id: '4967',
          product_id: 4,
          product_name: 'Smartwatch Fitbit',
          product_list_price: 19.99,
          product_min_promo_quantity: 1,
          product_max_promo_quantity: 3,
          product_min_promo_price: 14.99
        },
        {
          id: '9ef3',
          product_id: 5,
          product_name: 'Wireless Headphones Sony',
          product_list_price: 24.99,
          product_min_promo_quantity: 2,
          product_max_promo_quantity: 5,
          product_min_promo_price: 19.99
        }
      ];
      localStorage.setItem('productos', JSON.stringify(this.productos));
    }
  }

  cargarPromociones(): void {
    const promocionesGuardadas = localStorage.getItem('promociones');
    if (promocionesGuardadas) {
      this.promociones = JSON.parse(promocionesGuardadas);
    } else {
      this.promociones = [];
    }
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.limpiarFormulario();
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.productoSeleccionado = null;
    this.cantidadPromocional = 0;
    this.precioPromocional = 0;
    this.error = '';
    this.success = '';
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.precioPromocional = producto.product_min_promo_price;
    this.cantidadPromocional = producto.product_min_promo_quantity;
  }

  calcularDescuento(): number {
    if (!this.productoSeleccionado || this.precioPromocional <= 0) return 0;
    return Math.round(((this.productoSeleccionado.product_list_price - this.precioPromocional) / this.productoSeleccionado.product_list_price) * 100);
  }

  validarPromocion(): { esValida: boolean, mensaje: string } {
    if (!this.productoSeleccionado) {
      return { esValida: false, mensaje: 'Debe seleccionar un producto' };
    }

    if (this.cantidadPromocional < this.productoSeleccionado.product_min_promo_quantity || 
        this.cantidadPromocional > this.productoSeleccionado.product_max_promo_quantity) {
      return { 
        esValida: false, 
        mensaje: `Cantidad debe estar entre ${this.productoSeleccionado.product_min_promo_quantity} y ${this.productoSeleccionado.product_max_promo_quantity}` 
      };
    }

    if (this.precioPromocional < this.productoSeleccionado.product_min_promo_price) {
      return { 
        esValida: false, 
        mensaje: `Precio mínimo permitido: $${this.productoSeleccionado.product_min_promo_price}` 
      };
    }

    if (this.precioPromocional >= this.productoSeleccionado.product_list_price) {
      return { 
        esValida: false, 
        mensaje: 'El precio promocional debe ser menor al precio normal' 
      };
    }

    return { esValida: true, mensaje: 'Promoción válida' };
  }

  crearPromocion(): void {
    const validacion = this.validarPromocion();
    if (!validacion.esValida) {
      this.error = validacion.mensaje;
      return;
    }

    const nuevaPromocion: Promocion = {
      id: Date.now().toString(),
      producto: this.productoSeleccionado!,
      cantidad_promocional: this.cantidadPromocional,
      precio_promocional: this.precioPromocional,
      descuento_porcentaje: this.calcularDescuento(),
      creado_por: this.usuario.nombre || `${this.usuario.firstName} ${this.usuario.lastName}`,
      email_creador: this.usuario.email || 'analista@empresa.com',
      fecha_creacion: new Date().toISOString().split('T')[0],
      estado: 'pendiente'
    };

    this.promociones.push(nuevaPromocion);
    localStorage.setItem('promociones', JSON.stringify(this.promociones));

    this.success = 'Promoción creada exitosamente y enviada para revisión';
    this.error = '';
    
    setTimeout(() => {
      this.cerrarFormulario();
    }, 2000);
  }

  obtenerMisPromociones(): Promocion[] {
    const miNombre = this.usuario.nombre || `${this.usuario.firstName} ${this.usuario.lastName}`;
    return this.promociones.filter(p => p.creado_por === miNombre);
  }

  obtenerContadores() {
    const misPromociones = this.obtenerMisPromociones();
    return {
      total: misPromociones.length,
      pendientes: misPromociones.filter(p => p.estado === 'pendiente').length,
      aprobadas: misPromociones.filter(p => p.estado === 'aprobada').length,
      rechazadas: misPromociones.filter(p => p.estado === 'rechazada').length
    };
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}