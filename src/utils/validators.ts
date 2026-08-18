import type { LoginCredentials, LoginFormErrors } from '../types';

/** Longitud mínima de contraseña aceptada por el taller */
export const MIN_PASSWORD_LENGTH = 6;

/**
 * Regex de email deliberadamente simple y legible.
 * No intenta cumplir el RFC 5322 completo: en UX basta con detectar
 * errores evidentes y dejar que el backend haga la validación real.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Devuelve el mensaje de error del email, o null si es válido */
export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (value.length === 0) return 'El correo es obligatorio';
  if (!EMAIL_REGEX.test(value)) return 'Ingresa un correo válido (ej: ana@correo.com)';
  return null;
}

/** Devuelve el mensaje de error de la contraseña, o null si es válida */
export function validatePassword(password: string): string | null {
  if (password.length === 0) return 'La contraseña es obligatoria';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }
  return null;
}

/**
 * Valida el formulario completo.
 * Solo incluye en el objeto las claves que TIENEN error,
 * así `Object.keys(errors).length === 0` significa "formulario válido".
 */
export function validateLoginForm(credentials: LoginCredentials): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(credentials.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(credentials.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

/** Azúcar sintáctico para leer mejor en el componente */
export function isFormValid(errors: LoginFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
