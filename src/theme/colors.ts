/**
 * Paleta de color única de la app.
 * Regla UX: ningún componente escribe un color "a mano" (#FFF, 'red'...).
 * Todos los colores salen de aquí para que la app se vea coherente.
 */
export const colors = {
  // Marca
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',

  // Fondos
  background: '#F8FAFC',
  surface: '#FFFFFF',

  // Texto
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textOnPrimary: '#FFFFFF',
  textDisabled: '#94A3B8',

  // Bordes
  border: '#E2E8F0',
  borderFocus: '#2563EB',

  // Estados semánticos
  error: '#DC2626',
  errorLight: '#FEE2E2',
  success: '#16A34A',

  // Utilidades
  disabled: '#CBD5E1',
  overlay: 'rgba(15, 23, 42, 0.5)',
} as const;

export type ColorName = keyof typeof colors;
