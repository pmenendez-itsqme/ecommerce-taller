/**
 * Tipos compartidos del proyecto.
 * En etapas posteriores aquí añadiremos Product, CartItem, etc.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

/** Credenciales que el usuario escribe en el formulario de Login */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Resultado de un intento de login (patrón "Result": nunca lanza excepción) */
export type AuthResult =
  | { success: true; user: User }
  | { success: false; message: string };

/** Errores de validación del formulario: campo -> mensaje */
export type LoginFormErrors = Partial<Record<keyof LoginCredentials, string>>;

// ─────────────────────────────────────────────────────────────────────
//  ETAPA 3 — Productos
// ─────────────────────────────────────────────────────────────────────

/** Categorías disponibles en la tienda */
export const CATEGORIAS = ['Audio', 'Computación', 'Fotografía', 'Accesorios'] as const;

/** Union type derivada del arreglo: 'Audio' | 'Computación' | ... */
export type Categoria = (typeof CATEGORIAS)[number];

export interface Product {
  id: string;
  nombre: string;
  /** Frase corta para la tarjeta del listado */
  resumen: string;
  /** Texto largo para la pantalla de detalle */
  descripcion: string;
  /** Precio en dólares */
  precio: number;
  /** Precio anterior, si el producto está en oferta */
  precioAnterior?: number;
  categoria: Categoria;
  imagen: string;
  /** Color de respaldo si la imagen no carga */
  colorRespaldo: string;
  /** Emoji de respaldo si la imagen no carga */
  iconoRespaldo: string;
  /** Valoración de 0 a 5 */
  valoracion: number;
  /** Unidades disponibles. 0 = agotado */
  stock: number;
}
