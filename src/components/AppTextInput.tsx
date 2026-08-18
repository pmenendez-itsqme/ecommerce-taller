import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radius, spacing, typography, TOUCH_TARGET } from '../theme';

interface AppTextInputProps extends TextInputProps {
  /** Etiqueta visible sobre el campo (mejor que un placeholder solo: no desaparece al escribir) */
  label: string;
  /** Mensaje de error. Si viene con texto, el campo se pinta en rojo */
  error?: string;
  /** Muestra el botón "Mostrar / Ocultar" para contraseñas */
  isPassword?: boolean;
}

/**
 * Campo de texto reutilizable con 3 estados visuales: normal, enfocado y error.
 *
 * Decisiones de UX aplicadas aquí:
 * 1. Label SIEMPRE visible arriba (el placeholder solo desaparece al escribir
 *    y el usuario olvida qué campo era).
 * 2. El borde cambia de color al enfocar -> feedback inmediato de "dónde estoy".
 * 3. El error ocupa un espacio reservado, así el formulario NO "salta"
 *    cuando aparece o desaparece el mensaje.
 * 4. Altura mínima táctil de 48dp para que sea cómodo con el dedo.
 */
export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  ({ label, error, isPassword = false, style, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const hasError = Boolean(error);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            hasError && styles.inputWrapperError,
          ]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={colors.textDisabled}
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            // Accesibilidad: el lector de pantalla anuncia la etiqueta y el error
            accessibilityLabel={label}
            accessibilityHint={error}
            /**
             * BUG CLÁSICO EN ANDROID:
             * al pulsar "Mostrar", secureTextEntry pasa a false y el teclado
             * reactiva el autocorrector. Entonces puede añadir un ESPACIO INVISIBLE
             * al final de la contraseña o "corregir" la palabra, y el login falla
             * aunque en pantalla se lea exactamente lo correcto.
             * Estas 3 props lo desactivan para siempre en campos de contraseña.
             */
            {...rest}
            {...(isPassword && {
              autoCorrect: false,
              spellCheck: false,
              autoCapitalize: 'none' as const,
            })}
          />

          {isPassword && (
            <Pressable
              onPress={() => setIsPasswordVisible((v) => !v)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
            >
              <Text style={styles.toggle}>
                {isPasswordVisible ? 'Ocultar' : 'Mostrar'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Espacio reservado: evita que el layout salte al mostrar el error */}
        <Text style={styles.errorText} numberOfLines={1}>
          {error ?? ' '}
        </Text>
      </View>
    );
  }
);

AppTextInput.displayName = 'AppTextInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH_TARGET,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputWrapperFocused: {
    borderColor: colors.borderFocus,
  },
  inputWrapperError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm + 4,
  },
  toggle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    minHeight: 18,
    marginTop: spacing.xs,
  },
});
