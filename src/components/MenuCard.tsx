import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, TOUCH_TARGET } from '../theme';

interface MenuCardProps {
  /** Emoji o símbolo que identifica la opción de un vistazo */
  icono: string;
  titulo: string;
  descripcion: string;
  onPress: () => void;
  /** Contador opcional (ej. artículos en el carrito) */
  badge?: number;
  /** Marca la opción como "aún no disponible" */
  proximamente?: boolean;
}

/**
 * Tarjeta de acceso del menú principal.
 *
 * La creamos como componente reutilizable porque en la Home habrá varias
 * y en etapas siguientes reaparecerá. Si mañana hay que cambiar el aspecto
 * de todas las tarjetas, se toca UN archivo.
 */
export function MenuCard({
  icono,
  titulo,
  descripcion,
  onPress,
  badge,
  proximamente = false,
}: MenuCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={proximamente}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}. ${descripcion}`}
      accessibilityState={{ disabled: proximamente }}
      style={({ pressed }) => [
        styles.tarjeta,
        pressed && !proximamente && styles.pulsada,
        proximamente && styles.deshabilitada,
      ]}
    >
      <View style={styles.icono}>
        <Text style={styles.iconoTexto}>{icono}</Text>
      </View>

      <View style={styles.texto}>
        <View style={styles.filaTitulo}>
          <Text style={styles.titulo}>{titulo}</Text>
          {/* El badge solo aparece si hay algo que contar */}
          {badge !== undefined && badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.descripcion}>{descripcion}</Text>
      </View>

      <Text style={styles.flecha}>{proximamente ? '🔒' : '›'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    minHeight: TOUCH_TARGET + 16,
    // Sombra sutil para separar la tarjeta del fondo
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pulsada: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
  deshabilitada: {
    opacity: 0.55,
  },
  icono: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconoTexto: {
    fontSize: 24,
  },
  texto: {
    flex: 1,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo: {
    ...typography.label,
    fontSize: 16,
    color: colors.textPrimary,
  },
  badge: {
    marginLeft: spacing.sm,
    minWidth: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeTexto: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  descripcion: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  flecha: {
    fontSize: 22,
    color: colors.textDisabled,
    marginLeft: spacing.sm,
  },
});
