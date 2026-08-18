import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface QuantityStepperProps {
  cantidad: number;
  onCambiar: (nuevaCantidad: number) => void;
  /** Tope máximo, normalmente el stock del producto */
  maximo: number;
}

/**
 * Control − / cantidad / + para ajustar unidades.
 *
 * Detalle de UX: el botón + se deshabilita al llegar al stock, en vez
 * de dejar pulsar y mostrar un error después. Prevenir siempre es mejor
 * que corregir: el usuario no llega a equivocarse.
 */
export function QuantityStepper({ cantidad, onCambiar, maximo }: QuantityStepperProps) {
  const enElTope = cantidad >= maximo;

  return (
    <View style={styles.contenedor}>
      <Boton
        simbolo="−"
        onPress={() => onCambiar(cantidad - 1)}
        etiqueta="Quitar una unidad"
      />

      <Text style={styles.cantidad}>{cantidad}</Text>

      <Boton
        simbolo="+"
        onPress={() => onCambiar(cantidad + 1)}
        deshabilitado={enElTope}
        etiqueta="Añadir una unidad"
      />
    </View>
  );
}

function Boton({
  simbolo,
  onPress,
  deshabilitado = false,
  etiqueta,
}: {
  simbolo: string;
  onPress: () => void;
  deshabilitado?: boolean;
  etiqueta: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      accessibilityState={{ disabled: deshabilitado }}
      style={({ pressed }) => [
        styles.boton,
        pressed && !deshabilitado && styles.botonPulsado,
        deshabilitado && styles.botonInactivo,
      ]}
    >
      <Text style={[styles.botonTexto, deshabilitado && styles.botonTextoInactivo]}>
        {simbolo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 2,
  },
  boton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonPulsado: {
    backgroundColor: colors.primaryLight,
  },
  botonInactivo: {
    backgroundColor: 'transparent',
  },
  botonTexto: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 22,
  },
  botonTextoInactivo: {
    color: colors.textDisabled,
  },
  cantidad: {
    ...typography.label,
    fontSize: 15,
    color: colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
});
