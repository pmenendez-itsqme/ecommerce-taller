/**
 * Escala de espaciado basada en múltiplos de 4.
 * Usar spacing.md en vez de "16" hace que el layout sea consistente
 * y que un cambio global sea 1 línea de código.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Radios de borde */
export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 999,
} as const;

/**
 * Altura mínima táctil recomendada por las guías de accesibilidad
 * (Apple HIG: 44pt · Material Design: 48dp). Nunca hacer botones más pequeños.
 */
export const TOUCH_TARGET = 48;
