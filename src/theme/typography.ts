import { TextStyle } from 'react-native';

/**
 * Jerarquía tipográfica. Solo 5 estilos: si todo es "importante",
 * nada es importante. Menos estilos = interfaz más legible.
 */
export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
} satisfies Record<string, TextStyle>;
