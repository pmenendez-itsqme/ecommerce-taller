import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface TopBarProps {
  titulo: string;
  onVolver: () => void;
  /** Si se pasa, muestra el icono del carrito a la derecha */
  onAbrirCarrito?: () => void;
  /** Unidades en el carrito, para el contador rojo */
  unidadesCarrito?: number;
}

/**
 * Barra superior con botón de volver.
 *
 * Es una navegación "casera" que nos sirve hasta la Etapa 5, donde la
 * sustituiremos por el header de React Navigation. Tenerla como componente
 * hace que ese cambio afecte a un solo archivo.
 */
export function TopBar({
  titulo,
  onVolver,
  onAbrirCarrito,
  unidadesCarrito = 0,
}: TopBarProps) {
  return (
    <View style={styles.barra}>
      <Pressable
        onPress={onVolver}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        style={({ pressed }) => [styles.volver, pressed && styles.pulsado]}
      >
        <Text style={styles.volverTexto}>‹ Volver</Text>
      </Pressable>

      <Text style={styles.titulo} numberOfLines={1}>
        {titulo}
      </Text>

      {onAbrirCarrito && (
        <Pressable
          onPress={onAbrirCarrito}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Abrir carrito, ${unidadesCarrito} unidades`}
          style={({ pressed }) => [styles.carrito, pressed && styles.pulsado]}
        >
          <Text style={styles.carritoIcono}>🛒</Text>
          {unidadesCarrito > 0 && (
            <View style={styles.contador}>
              <Text style={styles.contadorTexto}>{unidadesCarrito}</Text>
            </View>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  volver: {
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  pulsado: {
    opacity: 0.6,
  },
  volverTexto: {
    ...typography.button,
    color: colors.primary,
  },
  titulo: {
    flex: 1,
    ...typography.label,
    fontSize: 15,
    color: colors.textPrimary,
  },
  carrito: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carritoIcono: {
    fontSize: 22,
  },
  contador: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  contadorTexto: {
    color: colors.textOnPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
});
