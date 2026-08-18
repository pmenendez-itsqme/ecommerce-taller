import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography, TOUCH_TARGET } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** Muestra un spinner y bloquea el botón. Evita el doble envío del formulario */
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Botón reutilizable con 3 variantes y estado de carga.
 *
 * Decisiones de UX aplicadas aquí:
 * 1. Estado `loading` con spinner: el usuario ve que "algo está pasando"
 *    y no pulsa 5 veces seguidas.
 * 2. Mientras carga, el botón queda deshabilitado -> imposible enviar dos veces.
 * 3. Feedback táctil: al presionar baja la opacidad (Pressable + pressed).
 * 4. Altura mínima de 48dp (guías de accesibilidad).
 */
export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const isBlocked = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isBlocked}
      accessibilityRole="button"
      accessibilityState={{ disabled: isBlocked, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isBlocked && styles.pressed,
        isBlocked && styles.blocked,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textOnPrimary : colors.primary}
        />
      ) : (
        <Text style={[styles.text, textStyles[variant], isBlocked && styles.textBlocked]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TOUCH_TARGET,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    minHeight: 40,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  blocked: {
    opacity: 0.6,
  },
  text: {
    ...typography.button,
  },
  textBlocked: {
    // El color se hereda de la variante; solo bajamos la opacidad del contenedor
  },
});

const textStyles = StyleSheet.create({
  primary: { color: colors.textOnPrimary },
  secondary: { color: colors.primary },
  ghost: { color: colors.primary },
});
