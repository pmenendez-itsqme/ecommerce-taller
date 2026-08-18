import React, { useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppButton, AppTextInput } from '../components';
import { PanelDiagnostico } from '../components/PanelDiagnostico';
import { login } from '../services/authService';
import { colors, radius, spacing, typography } from '../theme';
import type { LoginFormErrors, User } from '../types';
import { isFormValid, validateLoginForm } from '../utils/validators';

interface LoginScreenProps {
  /**
   * Se ejecuta cuando el login es correcto.
   * En la Etapa 5 aquí conectaremos la navegación hacia Home.
   */
  onLoginSuccess?: (user: User) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  // --- Estado del formulario -------------------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * "touched" = campos que el usuario ya visitó o intentó enviar.
   * Patrón UX clave: NO mostramos errores mientras el usuario escribe por
   * primera vez (sería agresivo mostrar "correo inválido" al teclear la 1ª letra).
   * Solo mostramos el error cuando sale del campo o pulsa "Iniciar sesión".
   */
  const [touched, setTouched] = useState({ email: false, password: false });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Referencia para saltar del campo email al de contraseña con el teclado
  const passwordRef = useRef<TextInput>(null);

  // --- Validación -------------------------------------------------------
  // useMemo: recalcula solo cuando cambian email o password
  const errors: LoginFormErrors = useMemo(
    () => validateLoginForm({ email, password }),
    [email, password]
  );

  const canSubmit = isFormValid(errors) && !isLoading;

  /** Solo mostramos el error si el campo ya fue "tocado" */
  const visibleError = (field: keyof LoginFormErrors) =>
    touched[field] ? errors[field] : undefined;

  const markTouched = (field: keyof LoginFormErrors) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // --- Envío ------------------------------------------------------------
  const handleSubmit = async () => {
    Keyboard.dismiss();
    setServerError(null);

    // Al pulsar el botón marcamos TODO como tocado para revelar los errores
    setTouched({ email: true, password: true });

    if (!isFormValid(errors)) return;

    setIsLoading(true);
    try {
      const result = await login({ email, password });

      if (result.success) {
        onLoginSuccess?.(result.user);
      } else {
        setServerError(result.message);
      }
    } catch {
      setServerError('No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      // finally: el spinner se apaga pase lo que pase (éxito, error o excepción)
      setIsLoading(false);
    }
  };

  // --- UI ---------------------------------------------------------------
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      // iOS empuja la vista; Android ya redimensiona la ventana por defecto
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Contenedor con ancho máximo.
            En móvil ocupa el 100%; en web/tablet se queda centrado a 440px
            para que la tarjeta no se estire a lo ancho de un monitor. */}
        <View style={styles.content}>
          {/* Cabecera de marca */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🛒</Text>
            </View>
            <Text style={styles.title}>Bienvenido de nuevo</Text>
            <Text style={styles.subtitle}>
              Inicia sesión para explorar nuestro catálogo
            </Text>
          </View>

          {/* Tarjeta del formulario */}
          <View style={styles.card}>
            <AppTextInput
              label="Correo electrónico"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setServerError(null);
              }}
              onBlur={() => markTouched('email')}
              error={visibleError('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              editable={!isLoading}
            />

            <AppTextInput
              ref={passwordRef}
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setServerError(null);
              }}
              onBlur={() => markTouched('password')}
              error={visibleError('password')}
              isPassword
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!isLoading}
            />

            {/* Error devuelto por el servicio de autenticación */}
            {serverError && (
              <View style={styles.serverErrorBox} accessibilityLiveRegion="polite">
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            )}

            <AppButton
              title="Iniciar sesión"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={!canSubmit}
              style={styles.submitButton}
            />

            <AppButton
              title="¿Olvidaste tu contraseña?"
              variant="ghost"
              onPress={() => {}}
              disabled={isLoading}
            />
          </View>

          {/* Ayuda para los estudiantes del taller */}
          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>Credenciales de prueba</Text>
            <Text style={styles.hintText}>estudiante@taller.com · 123456</Text>
          </View>

          {/* Herramienta de aula: solo existe en desarrollo */}
          {__DEV__ && <PanelDiagnostico email={email} password={password} />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  /**
   * Clave del diseño responsivo:
   * width 100% -> en un móvil de 360px ocupa los 360px.
   * maxWidth 440 -> en un monitor de 1920px se detiene en 440px.
   * Una sola regla cubre teléfono, tablet y escritorio.
   */
  content: {
    width: '100%',
    maxWidth: 440,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 36,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    // Sombra sutil: eleva la tarjeta sin ensuciar el diseño
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  serverErrorBox: {
    backgroundColor: colors.errorLight,
    borderRadius: radius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  serverErrorText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  hintBox: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  hintTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  hintText: {
    ...typography.caption,
    color: colors.textDisabled,
    marginTop: 2,
  },
});
