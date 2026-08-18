import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from './src/components';
import LoginScreen from './src/screens/LoginScreen';
import { colors, spacing, typography } from './src/theme';
import type { User } from './src/types';

/**
 * ETAPA 1 — Raíz de la aplicación.
 *
 * Por ahora manejamos el "usuario logueado" con un simple useState.
 * En la Etapa 5 esto se reemplazará por React Navigation
 * (Login -> Home -> Listado -> Detalle -> Carrito).
 */
export default function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {user ? (
        // Pantalla temporal: se sustituye por HomeScreen en la Etapa 2
        <View style={styles.placeholder}>
          <Text style={styles.emoji}>✅</Text>
          <Text style={styles.title}>¡Hola, {user.name}!</Text>
          <Text style={styles.text}>
            Autenticación correcta.{'\n'}La pantalla de Inicio llega en la Etapa 2.
          </Text>
          <AppButton
            title="Cerrar sesión"
            variant="secondary"
            onPress={() => setUser(null)}
            style={styles.button}
          />
        </View>
      ) : (
        <LoginScreen onLoginSuccess={setUser} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  text: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.xl,
    maxWidth: 280,
  },
});
