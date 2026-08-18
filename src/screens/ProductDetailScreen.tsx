import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components';
import { ProductImage } from '../components/ProductImage';
import { colors, radius, spacing, typography } from '../theme';
import type { Product } from '../types';
import { calcularDescuento, estrellas, formatearPrecio } from '../utils/formato';

interface ProductDetailScreenProps {
  producto: Product;
  /** Etapa 4: añadirá el producto al carrito */
  onAgregarAlCarrito?: (producto: Product) => void;
}

/**
 * ETAPA 3 — Detalle del producto
 *
 * Recibe el producto ya resuelto por props. No lo busca ella misma:
 * así el componente es "tonto" y se puede probar pasándole cualquier objeto.
 */
export default function ProductDetailScreen({
  producto,
  onAgregarAlCarrito,
}: ProductDetailScreenProps) {
  const descuento = calcularDescuento(producto.precio, producto.precioAnterior);
  const agotado = producto.stock === 0;
  const quedanPocas = producto.stock > 0 && producto.stock <= 5;

  return (
    <View style={styles.contenedor}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.centrado}>
          <View style={styles.contenido}>
            {/* Imagen grande */}
            <ProductImage
              uri={producto.imagen}
              colorRespaldo={producto.colorRespaldo}
              iconoRespaldo={producto.iconoRespaldo}
              tamanoIcono={80}
              style={styles.imagen}
            />

            <View style={styles.info}>
              {/* Categoría + valoración */}
              <View style={styles.filaSuperior}>
                <View style={styles.etiquetaCategoria}>
                  <Text style={styles.categoriaTexto}>{producto.categoria}</Text>
                </View>
                <Text style={styles.estrellas}>
                  {estrellas(producto.valoracion)}{' '}
                  <Text style={styles.valoracion}>{producto.valoracion.toFixed(1)}</Text>
                </Text>
              </View>

              <Text style={styles.nombre}>{producto.nombre}</Text>
              <Text style={styles.resumen}>{producto.resumen}</Text>

              {/* Precio */}
              <View style={styles.filaPrecio}>
                <Text style={styles.precio}>{formatearPrecio(producto.precio)}</Text>
                {producto.precioAnterior && (
                  <Text style={styles.precioAnterior}>
                    {formatearPrecio(producto.precioAnterior)}
                  </Text>
                )}
                {descuento && (
                  <View style={styles.insignia}>
                    <Text style={styles.insigniaTexto}>{descuento}</Text>
                  </View>
                )}
              </View>

              {/* Disponibilidad */}
              <View
                style={[
                  styles.stock,
                  agotado ? styles.stockAgotado : quedanPocas ? styles.stockBajo : styles.stockOk,
                ]}
              >
                <Text
                  style={[
                    styles.stockTexto,
                    agotado
                      ? styles.stockTextoAgotado
                      : quedanPocas
                        ? styles.stockTextoBajo
                        : styles.stockTextoOk,
                  ]}
                >
                  {agotado
                    ? 'Producto agotado'
                    : quedanPocas
                      ? `¡Solo quedan ${producto.stock} unidades!`
                      : `${producto.stock} unidades disponibles`}
                </Text>
              </View>

              {/* Descripción */}
              <Text style={styles.seccion}>Descripción</Text>
              <Text style={styles.descripcion}>{producto.descripcion}</Text>

              {/* Ficha técnica */}
              <Text style={styles.seccion}>Detalles</Text>
              <View style={styles.ficha}>
                <FilaFicha etiqueta="Código" valor={producto.id.toUpperCase()} />
                <FilaFicha etiqueta="Categoría" valor={producto.categoria} />
                <FilaFicha etiqueta="Valoración" valor={`${producto.valoracion} / 5`} />
                <FilaFicha
                  etiqueta="Disponibilidad"
                  valor={agotado ? 'Agotado' : `${producto.stock} unidades`}
                  ultima
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Barra fija inferior: la acción principal siempre visible,
          sin obligar al usuario a bajar hasta el final. */}
      <View style={styles.barraInferior}>
        <View style={styles.barraContenido}>
          <View>
            <Text style={styles.barraEtiqueta}>Precio total</Text>
            <Text style={styles.barraPrecio}>{formatearPrecio(producto.precio)}</Text>
          </View>

          <AppButton
            title={agotado ? 'No disponible' : 'Agregar al carrito'}
            onPress={() => onAgregarAlCarrito?.(producto)}
            disabled={agotado || !onAgregarAlCarrito}
            style={styles.botonAgregar}
          />
        </View>
      </View>
    </View>
  );
}

function FilaFicha({
  etiqueta,
  valor,
  ultima = false,
}: {
  etiqueta: string;
  valor: string;
  ultima?: boolean;
}) {
  return (
    <View style={[styles.filaFicha, !ultima && styles.filaFichaBorde]}>
      <Text style={styles.fichaEtiqueta}>{etiqueta}</Text>
      <Text style={styles.fichaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centrado: {
    alignItems: 'center',
  },
  contenido: {
    width: '100%',
    maxWidth: 480,
    paddingBottom: 110, // hueco para que la barra fija no tape el contenido
  },
  imagen: {
    width: '100%',
    height: 280,
  },
  info: {
    padding: spacing.lg,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  etiquetaCategoria: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  categoriaTexto: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  estrellas: {
    fontSize: 13,
    color: '#F59E0B',
  },
  valoracion: {
    color: colors.textSecondary,
  },
  nombre: {
    ...typography.title,
    fontSize: 23,
    color: colors.textPrimary,
  },
  resumen: {
    ...typography.subtitle,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  filaPrecio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  precio: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  precioAnterior: {
    ...typography.body,
    color: colors.textDisabled,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  insignia: {
    backgroundColor: colors.error,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginLeft: spacing.sm,
  },
  insigniaTexto: {
    color: colors.textOnPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  stock: {
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  stockOk: { backgroundColor: '#F0FDF4' },
  stockBajo: { backgroundColor: '#FFFBEB' },
  stockAgotado: { backgroundColor: colors.errorLight },
  stockTexto: {
    ...typography.caption,
    fontWeight: '600',
  },
  stockTextoOk: { color: colors.success },
  stockTextoBajo: { color: '#B45309' },
  stockTextoAgotado: { color: colors.error },
  seccion: {
    ...typography.label,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  descripcion: {
    ...typography.body,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 23,
  },
  ficha: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  filaFicha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
  },
  filaFichaBorde: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fichaEtiqueta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  fichaValor: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  barraInferior: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  barraContenido: {
    width: '100%',
    maxWidth: 480,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  barraEtiqueta: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  barraPrecio: {
    ...typography.label,
    fontSize: 20,
    color: colors.textPrimary,
  },
  botonAgregar: {
    flex: 1,
    maxWidth: 220,
  },
});
