import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components';
import { CartItemRow } from '../components/CartItemRow';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useCart } from '../context/CartContext';
import type { MainTabParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';
import { IVA } from '../utils/carrito';
import { formatearPrecio } from '../utils/formato';

type Props = BottomTabScreenProps<MainTabParamList, 'Carrito'>;

/**
 * ETAPAS 4 y 5 — Pantalla del carrito de compras.
 *
 * No recibe los productos por props: los pide al estado global con
 * useCart(). Esa es la ventaja del Context.
 */
export default function CartScreen({ navigation }: Props) {
  /** Lleva al usuario al catálogo (otra pestaña) */
  const onSeguirComprando = () => navigation.navigate('Productos');

  const { items, totales, cambiarCantidad, quitar, vaciar } = useCart();
  const [confirmandoVaciar, setConfirmandoVaciar] = useState(false);
  const [compraRealizada, setCompraRealizada] = useState(false);

  // ---- Estado: compra finalizada ----
  if (compraRealizada) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.exitoIcono}>🎉</Text>
        <Text style={styles.exitoTitulo}>¡Compra realizada!</Text>
        <Text style={styles.exitoTexto}>
          Gracias por tu pedido. Recibirás un correo con el comprobante.
        </Text>
        <AppButton
          title="Seguir comprando"
          onPress={() => {
            setCompraRealizada(false);
            onSeguirComprando();
          }}
          style={styles.botonAncho}
        />
      </View>
    );
  }

  // ---- Estado: carrito vacío ----
  if (items.length === 0) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.vacioIcono}>🛒</Text>
        <Text style={styles.vacioTitulo}>Tu carrito está vacío</Text>
        <Text style={styles.vacioTexto}>
          Explora el catálogo y añade productos para verlos aquí.
        </Text>
        <AppButton
          title="Ver productos"
          onPress={onSeguirComprando}
          style={styles.botonAncho}
        />
      </View>
    );
  }

  // ---- Estado: carrito con productos ----
  return (
    <View style={styles.contenedor}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.producto.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.cabecera}>
            <Text style={styles.contador}>
              {totales.unidades} {totales.unidades === 1 ? 'unidad' : 'unidades'} ·{' '}
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CartItemRow item={item} onCambiarCantidad={cambiarCantidad} onQuitar={quitar} />
        )}
        ListFooterComponent={
          <View>
            {/* Resumen económico */}
            <View style={styles.resumen}>
              <Text style={styles.resumenTitulo}>Resumen de compra</Text>

              <FilaResumen etiqueta="Subtotal" valor={formatearPrecio(totales.subtotal)} />
              <FilaResumen
                etiqueta={`IVA (${(IVA * 100).toFixed(0)}%)`}
                valor={formatearPrecio(totales.iva)}
              />

              <View style={styles.separador} />

              <View style={styles.filaTotal}>
                <Text style={styles.totalEtiqueta}>Total a pagar</Text>
                <Text style={styles.totalValor}>{formatearPrecio(totales.total)}</Text>
              </View>
            </View>

            {/* Vaciar carrito, con confirmación en dos pasos.
                Evitamos Alert.alert() porque en web no se muestra igual. */}
            {confirmandoVaciar ? (
              <View style={styles.confirmacion}>
                <Text style={styles.confirmacionTexto}>
                  ¿Seguro que quieres vaciar el carrito?
                </Text>
                <View style={styles.confirmacionBotones}>
                  <Pressable
                    onPress={() => setConfirmandoVaciar(false)}
                    style={styles.confirmarNo}
                    accessibilityRole="button"
                  >
                    <Text style={styles.confirmarNoTexto}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      vaciar();
                      setConfirmandoVaciar(false);
                    }}
                    style={styles.confirmarSi}
                    accessibilityRole="button"
                  >
                    <Text style={styles.confirmarSiTexto}>Sí, vaciar</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setConfirmandoVaciar(true)}
                style={styles.vaciar}
                accessibilityRole="button"
              >
                <Text style={styles.vaciarTexto}>Vaciar carrito</Text>
              </Pressable>
            )}
          </View>
        }
      />

      {/* Barra fija con la acción principal */}
      <View style={styles.barra}>
        <View style={styles.barraContenido}>
          <View>
            <Text style={styles.barraEtiqueta}>Total</Text>
            <Text style={styles.barraTotal}>{formatearPrecio(totales.total)}</Text>
          </View>

          <AppButton
            title="Finalizar compra"
            onPress={() => {
              vaciar();
              setCompraRealizada(true);
            }}
            style={styles.botonPagar}
          />
        </View>
      </View>
    </View>
  );
}

function FilaResumen({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.filaResumen}>
      <Text style={styles.resumenEtiqueta}>{etiqueta}</Text>
      <Text style={styles.resumenValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    padding: spacing.md,
    paddingBottom: 120, // hueco para la barra fija
  },
  cabecera: {
    marginBottom: spacing.md,
  },
  titulo: {
    ...typography.title,
    fontSize: 24,
    color: colors.textPrimary,
  },
  contador: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resumen: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  resumenTitulo: {
    ...typography.label,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm + 2,
  },
  filaResumen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  resumenEtiqueta: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  resumenValor: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  separador: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  filaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalEtiqueta: {
    ...typography.label,
    fontSize: 16,
    color: colors.textPrimary,
  },
  totalValor: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  vaciar: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  vaciarTexto: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.error,
    textDecorationLine: 'underline',
  },
  confirmacion: {
    backgroundColor: colors.errorLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  confirmacionTexto: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  confirmacionBotones: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  confirmarNo: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  confirmarNoTexto: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmarSi: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.error,
    alignItems: 'center',
  },
  confirmarSiTexto: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  barra: {
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
  barraTotal: {
    ...typography.label,
    fontSize: 20,
    color: colors.textPrimary,
  },
  botonPagar: {
    flex: 1,
    maxWidth: 220,
  },
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  vacioIcono: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  vacioTitulo: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  vacioTexto: {
    ...typography.subtitle,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  exitoIcono: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  exitoTitulo: {
    ...typography.title,
    fontSize: 22,
    color: colors.success,
    textAlign: 'center',
  },
  exitoTexto: {
    ...typography.subtitle,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  botonAncho: {
    maxWidth: 280,
  },
});
