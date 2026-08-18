import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import type { Product } from '../types';
import { calcularDescuento, estrellas, formatearPrecio } from '../utils/formato';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  producto: Product;
  onPress: (producto: Product) => void;
}

/**
 * Tarjeta de producto del listado.
 *
 * Este es el componente reutilizable que pide el enunciado de la Etapa 3.
 * Recibe UN producto y una función; no sabe de dónde salen los datos ni
 * qué pasa al pulsarlo. Eso lo hace reutilizable en cualquier pantalla.
 */
export function ProductCard({ producto, onPress }: ProductCardProps) {
  const descuento = calcularDescuento(producto.precio, producto.precioAnterior);
  const agotado = producto.stock === 0;

  return (
    <Pressable
      onPress={() => onPress(producto)}
      accessibilityRole="button"
      accessibilityLabel={`${producto.nombre}, ${formatearPrecio(producto.precio)}`}
      style={({ pressed }) => [
        styles.tarjeta,
        pressed && styles.pulsada,
        agotado && styles.agotada,
      ]}
    >
      <View style={styles.zonaImagen}>
        <ProductImage
          uri={producto.imagen}
          colorRespaldo={producto.colorRespaldo}
          iconoRespaldo={producto.iconoRespaldo}
          style={styles.imagen}
        />

        {/* Insignia de descuento, solo si hay rebaja real */}
        {descuento && !agotado && (
          <View style={styles.insignia}>
            <Text style={styles.insigniaTexto}>{descuento}</Text>
          </View>
        )}

        {agotado && (
          <View style={styles.velo}>
            <Text style={styles.veloTexto}>AGOTADO</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        {/* numberOfLines evita que un nombre largo desalinee la cuadrícula */}
        <Text style={styles.nombre} numberOfLines={2}>
          {producto.nombre}
        </Text>

        <Text style={styles.resumen} numberOfLines={1}>
          {producto.resumen}
        </Text>

        <View style={styles.filaValoracion}>
          <Text style={styles.estrellas}>{estrellas(producto.valoracion)}</Text>
          <Text style={styles.valoracion}>{producto.valoracion.toFixed(1)}</Text>
        </View>

        <View style={styles.filaPrecio}>
          <Text style={styles.precio}>{formatearPrecio(producto.precio)}</Text>
          {producto.precioAnterior && (
            <Text style={styles.precioAnterior}>
              {formatearPrecio(producto.precioAnterior)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pulsada: {
    opacity: 0.75,
  },
  agotada: {
    opacity: 0.75,
  },
  zonaImagen: {
    height: 130,
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  insignia: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.error,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  insigniaTexto: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  velo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  veloTexto: {
    color: colors.textOnPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  info: {
    padding: spacing.sm + 2,
  },
  nombre: {
    ...typography.label,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 36, // 2 líneas: mantiene las tarjetas a la misma altura
  },
  resumen: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filaValoracion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  estrellas: {
    fontSize: 11,
    color: '#F59E0B',
  },
  valoracion: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textDisabled,
    marginLeft: 4,
  },
  filaPrecio: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xs + 2,
  },
  precio: {
    ...typography.label,
    fontSize: 16,
    color: colors.primary,
  },
  precioAnterior: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textDisabled,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs + 2,
  },
});
