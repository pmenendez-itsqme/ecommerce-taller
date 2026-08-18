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
