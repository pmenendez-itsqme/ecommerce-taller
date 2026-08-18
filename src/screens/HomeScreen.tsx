import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '../components';
import { MenuCard } from '../components/MenuCard';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { colors, radius, spacing, typography } from '../theme';
import type { MainTabParamList } from '../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Inicio'>;

/**
 * ETAPAS 2 y 5 — Pantalla de Inicio (Home)
 *
 * Con React Navigation la pantalla recibe `navigation` automáticamente,
 * y el usuario y el carrito salen de los contextos globales.
 * Ya no necesita ni una sola prop del componente padre.
 */
export default function HomeScreen({ navigation }: Props) {
  /**
   * Esta pantalla oculta el header, así que el contenido empezaría
   * debajo de la muesca o la barra de estado. insets.top nos da esa
   * altura exacta en CADA dispositivo, sin números mágicos.
   */
  const insets = useSafeAreaInsets();
  const { user, cerrarSesion } = useAuth();
  const { totales, vaciar } = useCart();

  // El navegador solo monta esta pantalla con sesión iniciada,
  // pero TypeScript no lo sabe: esta guarda lo tranquiliza.
  if (!user) return null;

  const itemsEnCarrito = totales.unidades;

  const onLogout = () => {
    // El carrito pertenece al usuario: al salir se vacía.
    vaciar();
    cerrarSesion();
  };
  // Primera letra del nombre para el avatar. El '?' evita reventar
  // si algún día llegara un usuario sin nombre.
  const inicial = user.name?.trim().charAt(0).toUpperCase() ?? '?';

  // Solo el primer nombre: "Hola, Estudiante" lee mejor que el nombre completo
  const primerNombre = user.name.trim().split(' ')[0];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + spacing.lg },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.fondo}
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
          onPress={() => navigation.navigate('Productos')}
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
          onPress={() => navigation.navigate('Carrito')}
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
  fondo: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
