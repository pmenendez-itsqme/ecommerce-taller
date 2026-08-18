import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components';
import { MenuCard } from '../components/MenuCard';
import { colors, radius, spacing, typography } from '../theme';
import type { User } from '../types';

interface HomeScreenProps {
  user: User;
  onLogout: () => void;
  /** Etapa 3: llevará al listado de productos */
  onVerProductos?: () => void;
  /** Etapa 4: llevará al carrito de compras */
  onVerCarrito?: () => void;
  /** Etapa 4: número de artículos en el carrito */
  itemsEnCarrito?: number;
}

/**
 * ETAPA 2 — Pantalla de Inicio (Home)
 *
 * Es el panel de bienvenida al que se llega tras iniciar sesión.
 * Su trabajo es orientar: quién eres y a dónde puedes ir.
 */
export default function HomeScreen({
  user,
  onLogout,
  onVerProductos,
  onVerCarrito,
  itemsEnCarrito = 0,
}: HomeScreenProps) {
  // Primera letra del nombre para el avatar. El '?' evita reventar
  // si algún día llegara un usuario sin nombre.
  const inicial = user.name?.trim().charAt(0).toUpperCase() ?? '?';

  // Solo el primer nombre: "Hola, Estudiante" lee mejor que el nombre completo
  const primerNombre = user.name.trim().split(' ')[0];

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contenido}>
        {/* Cabecera con identidad del usuario */}
        <View style={styles.cabecera}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{inicial}</Text>
          </View>
          <View style={styles.datos}>
            <Text style={styles.saludo}>{obtenerSaludo()},</Text>
            <Text style={styles.nombre} numberOfLines={1}>
              {primerNombre}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>

        {/* Banner de bienvenida */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitulo}>Bienvenido a la tienda</Text>
          <Text style={styles.bannerTexto}>
            Explora el catálogo, guarda tus favoritos y finaliza tu compra en un
            par de toques.
          </Text>
        </View>

        {/* Menú de accesos */}
        <Text style={styles.seccion}>¿Qué quieres hacer?</Text>

        <MenuCard
          icono="🛍️"
          titulo="Ver productos"
          descripcion="Explora el catálogo completo"
          onPress={() => onVerProductos?.()}
          proximamente={!onVerProductos}
        />

        <MenuCard
          icono="🛒"
          titulo="Mi carrito"
          descripcion={
            itemsEnCarrito > 0
              ? `${itemsEnCarrito} artículo${itemsEnCarrito === 1 ? '' : 's'} listo${
                  itemsEnCarrito === 1 ? '' : 's'
                } para comprar`
              : 'Aún no has añadido nada'
          }
          badge={itemsEnCarrito}
          onPress={() => onVerCarrito?.()}
          proximamente={!onVerCarrito}
        />

        <AppButton
          title="Cerrar sesión"
          variant="secondary"
          onPress={onLogout}
          style={styles.botonSalir}
        />
      </View>
    </ScrollView>
  );
}

/** Saludo según la hora del dispositivo: un detalle pequeño que se nota */
function obtenerSaludo(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    padding: spacing.lg,
  },
  contenido: {
    width: '100%',
    maxWidth: 440,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarTexto: {
    color: colors.textOnPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  datos: {
    flex: 1,
  },
  saludo: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  nombre: {
    ...typography.title,
    fontSize: 24,
    color: colors.textPrimary,
  },
  email: {
    ...typography.caption,
    color: colors.textDisabled,
    marginTop: 2,
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  bannerTitulo: {
    ...typography.label,
    fontSize: 18,
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  bannerTexto: {
    ...typography.caption,
    fontSize: 14,
    color: colors.primaryLight,
    lineHeight: 20,
  },
  seccion: {
    ...typography.label,
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm + 4,
  },
  botonSalir: {
    marginTop: spacing.lg,
  },
});
