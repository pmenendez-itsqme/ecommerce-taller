import type { AuthResult, LoginCredentials, User } from '../types';
import { MIN_PASSWORD_LENGTH } from '../utils/validators';

/**
 * Servicio de autenticación SIMULADO (mock).
 *
 * ¿Por qué un servicio y no poner esto dentro de la pantalla?
 * Porque cuando en el futuro conectes una API real (fetch/axios/Firebase),
 * solo cambias este archivo. La pantalla de Login no se toca.
 * Esto se llama "separación de responsabilidades".
 */

/**
 * Base de usuarios de prueba del taller.
 *
 * PARA AÑADIR UN USUARIO: copia un bloque y cambia los 4 campos.
 *   - id:       debe ser único
 *   - email:    en minúsculas y sin espacios (igual se normaliza al comparar)
 *   - password: MÍNIMO 6 caracteres, si no el formulario ni siquiera te dejará enviar
 */
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Estudiante Demo',
    email: 'estudiante@taller.com',
    password: '123456',
  },
  {
    id: '2',
    name: 'Pablo Menendez',
    email: 'pablo@taller.com',
    password: 'taller2026',
  },
  {
    id: '3',
    name: 'María Torres',
    email: 'maria@taller.com',
    password: 'maria123',
  },
];

/** Deja el correo en un formato canónico para poder compararlo sin sorpresas */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Aviso de desarrollo: revisa la lista de usuarios al arrancar y explica en la
 * consola por qué un usuario nunca podría iniciar sesión.
 * `__DEV__` es true solo en desarrollo, así que esto NO se ejecuta en producción.
 */
if (__DEV__) {
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();

  MOCK_USERS.forEach((user, index) => {
    const label = `MOCK_USERS[${index}] (${user.email})`;

    if (user.password.length < MIN_PASSWORD_LENGTH) {
      console.warn(
        `[authService] ${label}: la contraseña tiene ${user.password.length} caracteres. ` +
          `El formulario exige ${MIN_PASSWORD_LENGTH} y bloqueará el botón antes de llamar al servicio.`
      );
    }
    if (user.email !== normalizeEmail(user.email)) {
      console.warn(
        `[authService] ${label}: el correo tiene mayúsculas o espacios. Escríbelo en minúsculas.`
      );
    }
    if (user.password !== user.password.trim()) {
      console.warn(`[authService] ${label}: la contraseña tiene espacios al inicio o al final.`);
    }
    if (seenIds.has(user.id)) {
      console.warn(`[authService] ${label}: el id "${user.id}" está repetido.`);
    }
    if (seenEmails.has(normalizeEmail(user.email))) {
      console.warn(`[authService] ${label}: el correo está repetido.`);
    }

    seenIds.add(user.id);
    seenEmails.add(normalizeEmail(user.email));
  });
}

// ─────────────────────────────────────────────────────────────────────
//  API de diagnóstico (solo se usa en la pantalla de desarrollo)
// ─────────────────────────────────────────────────────────────────────

/** Correos que el BUNDLE EN EJECUCIÓN tiene cargados ahora mismo */
export function listarCorreosMock(): string[] {
  return MOCK_USERS.map((u) => u.email);
}

export type MotivoFallo =
  | 'correo-no-existe'
  | 'password-no-coincide'
  | 'password-solo-espacios'
  | 'ok';

export interface Diagnostico {
  motivo: MotivoFallo;
  /** Contraseña esperada para ese correo (solo en desarrollo) */
  passwordEsperada?: string;
}

/**
 * Compara unas credenciales contra la lista mock y explica QUÉ falla.
 * No sustituye a login(): es una herramienta de aula para ver el porqué.
 */
export function diagnosticar(email: string, password: string): Diagnostico {
  const objetivo = normalizeEmail(email);
  const encontrado = MOCK_USERS.find((u) => normalizeEmail(u.email) === objetivo);

  if (!encontrado) return { motivo: 'correo-no-existe' };
  if (encontrado.password === password) return { motivo: 'ok' };
  if (encontrado.password === password.trim()) {
    return { motivo: 'password-solo-espacios', passwordEsperada: encontrado.password };
  }
  return { motivo: 'password-no-coincide', passwordEsperada: encontrado.password };
}

/** Simula la latencia de red para poder ver el estado de "cargando" */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Intenta iniciar sesión.
 * Devuelve siempre un AuthResult (nunca lanza), lo que obliga
 * a la pantalla a manejar el caso de error de forma explícita.
 */
export async function login({ email, password }: LoginCredentials): Promise<AuthResult> {
  await delay(1200);

  const inputEmail = normalizeEmail(email);

  // Normalizamos AMBOS lados: así el login funciona aunque el correo del
  // arreglo se haya escrito como "Maria@Taller.com " por descuido.
  const found = MOCK_USERS.find((u) => normalizeEmail(u.email) === inputEmail);

  // Mensaje genérico a propósito: no revelamos si el correo existe o no.
  // Es una buena práctica de seguridad (evita enumeración de usuarios).
  if (!found || found.password !== password) {
    if (__DEV__) {
      // --- Diagnóstico solo para el desarrollador, nunca para el usuario final ---
      console.log('══════ [authService] LOGIN FALLIDO ══════');
      console.log(`Correos en MOCK_USERS: ${MOCK_USERS.map((u) => u.email).join(', ')}`);

      if (!found) {
        console.log(`✗ "${inputEmail}" NO está en la lista de arriba.`);
        console.log('  → Metro está sirviendo una versión antigua del archivo,');
        console.log('    o editaste una carpeta distinta a la que ejecuta Expo.');
        console.log('  → Solución: detén Expo y arranca con  npx expo start --clear');
      } else {
        console.log(`✓ El correo existe. La contraseña NO coincide:`);
        // JSON.stringify revela espacios y caracteres invisibles del teclado
        console.log(`  esperada: ${JSON.stringify(found.password)} (${found.password.length} car.)`);
        console.log(`  recibida: ${JSON.stringify(password)} (${password.length} car.)`);
        if (password.trim() === found.password) {
          console.log('  → El autocorrector de Android añadió un espacio invisible.');
        }
      }
      console.log('═════════════════════════════════════════');
    }
    return { success: false, message: 'Correo o contraseña incorrectos' };
  }

  const { password: _omit, ...user } = found;
  return { success: true, user };
}
