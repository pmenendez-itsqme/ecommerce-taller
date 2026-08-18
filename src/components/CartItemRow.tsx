import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import type { CartItem } from '../types';
import { formatearPrecio } from '../utils/formato';
import { ProductImage } from './ProductImage';
import { QuantityStepper } from './QuantityStepper';

interface CartItemRowProps {
  item: CartItem;
  onCambiarCantidad: (productoId: string, cantidad: number) => void;
  onQuitar: (productoId: string) => void;
}

/** Una línea del carrito: imagen, datos, control de cantidad y subtotal */
export function CartItemRow({ item, onCambiarCantidad, onQuitar }: CartItemRowProps) {
  const { producto, cantidad } = item;

  // Subtotal de ESTA línea: el usuario ve cuánto suma cada producto
  const subtotalLinea = producto.precio * cantidad;

  return (
    <View style={styles.fila}>
      <ProductImage
        uri={producto.imagen}
        colorRespaldo={producto.colorRespaldo}
        iconoRespaldo={producto.iconoRespaldo}
        tamanoIcono={28}
        style={styles.imagen}
      />

      <View style={styles.centro}>
        <Text style={styles.nombre} numberOfLines={2}>
          {producto.nombre}
        </Text>

        <Text style={styles.precioUnitario}>
          {formatearPrecio(producto.precio)} c/u
        </Text>

        <View style={styles.controles}>
          <QuantityStepper
            cantidad={cantidad}
            maximo={producto.stock}
            onCambiar={(nueva) => onCambiarCantidad(producto.id, nueva)}
          />

          <Pressable
            onPress={() => onQuitar(producto.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${producto.nombre} del carrito`}
            style={({ pressed }) => [styles.eliminar, pressed && styles.eliminarPulsado]}
          >
            <Text style={styles.eliminarTexto}>Eliminar</Text>
          </Pressable>
        </View>

        {/* Aviso solo cuando el usuario ya agotó las unidades disponibles */}
        {cantidad >= producto.stock && (
          <Text style={styles.aviso}>Máximo disponible: {producto.stock}</Text>
        )}
      </View>

      <Text style={styles.subtotal}>{formatearPrecio(subtotalLinea)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm + 4,
  },
  imagen: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  centro: {
    flex: 1,
    marginLeft: spacing.sm + 4,
    marginRight: spacing.sm,
  },
  nombre: {
    ...typography.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
  precioUnitario: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm + 4,
  },
  eliminar: {
    paddingVertical: spacing.xs,
  },
  eliminarPulsado: {
    opacity: 0.6,
  },
  eliminarTexto: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  aviso: {
    ...typography.caption,
    fontSize: 11,
    color: '#B45309',
    marginTop: spacing.xs,
  },
  subtotal: {
    ...typography.label,
    fontSize: 15,
    color: colors.textPrimary,
    minWidth: 72,
    textAlign: 'right',
  },
});
