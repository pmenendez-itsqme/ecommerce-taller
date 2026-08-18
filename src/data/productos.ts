import type { Product } from '../types';

/**
 * CATÁLOGO SIMULADO (mock data).
 *
 * Igual que con los usuarios: el día que conectes una API real,
 * cambias este archivo por un `fetch()` y las pantallas no se tocan.
 *
 * Las imágenes vienen de Unsplash. Si no cargan (sin internet, o la URL
 * cambió), cada producto tiene su `colorRespaldo` y `iconoRespaldo`,
 * así la tarjeta nunca aparece rota.
 */
export const PRODUCTOS: Product[] = [
  {
    id: 'p1',
    nombre: 'Audífonos Studio Pro',
    resumen: 'Cancelación activa de ruido',
    descripcion:
      'Audífonos over-ear con cancelación activa de ruido de 40 dB y hasta 38 horas de batería. ' +
      'Almohadillas de espuma viscoelástica y estuche rígido de viaje incluido.',
    precio: 189.9,
    precioAnterior: 229.9,
    categoria: 'Audio',
    imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    colorRespaldo: '#1E3A8A',
    iconoRespaldo: '🎧',
    valoracion: 4.7,
    stock: 12,
  },
  {
    id: 'p2',
    nombre: 'Reloj Inteligente Series 7',
    resumen: 'Monitor cardíaco y GPS',
    descripcion:
      'Pantalla AMOLED siempre activa, sensor de frecuencia cardíaca, GPS integrado y ' +
      'resistencia al agua 5 ATM. Batería de 7 días con uso normal.',
    precio: 249.0,
    categoria: 'Accesorios',
    imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    colorRespaldo: '#0F766E',
    iconoRespaldo: '⌚',
    valoracion: 4.5,
    stock: 8,
  },
  {
    id: 'p3',
    nombre: 'Laptop UltraBook 14"',
    resumen: '16 GB RAM · SSD 512 GB',
    descripcion:
      'Procesador de 8 núcleos, 16 GB de RAM y SSD NVMe de 512 GB. Pantalla IPS de 14" ' +
      'con 100% sRGB y chasis de aluminio de 1.2 kg.',
    precio: 1099.0,
    precioAnterior: 1299.0,
    categoria: 'Computación',
    imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    colorRespaldo: '#334155',
    iconoRespaldo: '💻',
    valoracion: 4.8,
    stock: 4,
  },
  {
    id: 'p4',
    nombre: 'Cámara Mirrorless X20',
    resumen: 'Sensor APS-C de 24 MP',
    descripcion:
      'Sensor APS-C de 24.2 MP, grabación 4K a 60 fps y estabilización de 5 ejes. ' +
      'Incluye lente 18-55 mm y dos baterías.',
    precio: 879.5,
    categoria: 'Fotografía',
    imagen: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    colorRespaldo: '#7C2D12',
    iconoRespaldo: '📷',
    valoracion: 4.6,
    stock: 3,
  },
  {
    id: 'p5',
    nombre: 'Teclado Mecánico RGB',
    resumen: 'Switches rojos · inalámbrico',
    descripcion:
      'Teclado mecánico 75% con switches rojos lineales, retroiluminación RGB por tecla ' +
      'y conexión triple: cable, Bluetooth y receptor de 2.4 GHz.',
    precio: 89.99,
    categoria: 'Computación',
    imagen: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    colorRespaldo: '#4C1D95',
    iconoRespaldo: '⌨️',
    valoracion: 4.4,
    stock: 20,
  },
  {
    id: 'p6',
    nombre: 'Parlante Bluetooth Wave',
    resumen: 'Resistente al agua IPX7',
    descripcion:
      'Sonido de 360° con 30 W de potencia, certificación IPX7 y 20 horas de reproducción. ' +
      'Se pueden emparejar dos unidades en estéreo.',
    precio: 79.0,
    precioAnterior: 99.0,
    categoria: 'Audio',
    imagen: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    colorRespaldo: '#B45309',
    iconoRespaldo: '🔊',
    valoracion: 4.3,
    stock: 15,
  },
  {
    id: 'p7',
    nombre: 'Mouse Ergonómico Silent',
    resumen: 'Clic silencioso · 4000 DPI',
    descripcion:
      'Diseño vertical que reduce la tensión de la muñeca. Sensor de 4000 DPI ajustable ' +
      'y clics silenciosos. Batería recargable de 60 días.',
    precio: 34.9,
    categoria: 'Computación',
    imagen: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    colorRespaldo: '#155E75',
    iconoRespaldo: '🖱️',
    valoracion: 4.2,
    stock: 30,
  },
  {
    id: 'p8',
    nombre: 'Mochila Antirrobo Urban',
    resumen: 'Puerto USB · laptop 15.6"',
    descripcion:
      'Compartimento acolchado para laptop de 15.6", cierres ocultos antirrobo, ' +
      'puerto USB externo y tela repelente al agua.',
    precio: 59.5,
    categoria: 'Accesorios',
    imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    colorRespaldo: '#166534',
    iconoRespaldo: '🎒',
    valoracion: 4.5,
    stock: 0, // agotado: sirve para probar ese estado en la interfaz
  },
  {
    id: 'p9',
    nombre: 'Trípode de Fibra de Carbono',
    resumen: 'Ligero · altura 165 cm',
    descripcion:
      'Trípode de fibra de carbono de 1.3 kg que soporta hasta 12 kg. Rótula de bola ' +
      'con desbloqueo rápido y patas convertibles en monopié.',
    precio: 145.0,
    categoria: 'Fotografía',
    imagen: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=600&q=80',
    colorRespaldo: '#3F3F46',
    iconoRespaldo: '📐',
    valoracion: 4.6,
    stock: 6,
  },
  {
    id: 'p10',
    nombre: 'Audífonos In-Ear Sport',
    resumen: 'Deportivos · 8 h de batería',
    descripcion:
      'Audífonos inalámbricos con aletas de sujeción, resistencia al sudor IPX5 y ' +
      'estuche de carga que suma 24 horas adicionales.',
    precio: 49.9,
    categoria: 'Audio',
    imagen: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    colorRespaldo: '#9D174D',
    iconoRespaldo: '🎵',
    valoracion: 4.1,
    stock: 25,
  },
];

/** Busca un producto por su id. Devuelve undefined si no existe. */
export function obtenerProductoPorId(id: string): Product | undefined {
  return PRODUCTOS.find((p) => p.id === id);
}
