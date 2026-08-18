import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import CartScreen from '../screens/CartScreen';
import HomeScreen from '../screens/HomeScreen';
import { colors } from '../theme';
import { ProductStack } from './ProductStack';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Barra de pestañas inferior.
 *
 * Las 3 secciones principales están siempre a un toque de distancia.
 * Es el patrón de navegación más usado en apps de comercio porque
 * el usuario nunca se pierde: siempre ve dónde puede ir.
 */
export function MainTabs() {
  // El contador del carrito sale del estado global de la Etapa 4
  const { totales } = useCart();

  /**
   * Altura de la barra calculada, no adivinada.
   * ALTO_BARRA es el espacio que necesitan icono + etiqueta; insets.bottom
   * es la franja del gesto de Android/iOS. Sumarlos evita que las
   * etiquetas queden cortadas en unos móviles y sobre espacio en otros.
   */
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.textPrimary, fontSize: 16 },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDisabled,
        tabBarStyle: [
          styles.barra,
          { height: ALTO_BARRA + insets.bottom, paddingBottom: insets.bottom + 6 },
        ],
        tabBarLabelStyle: styles.etiqueta,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          headerShown: false, // la Home ya trae su propia cabecera
          tabBarIcon: ({ focused }) => <Icono emoji="🏠" activo={focused} />,
        }}
      />

      <Tab.Screen
        name="Productos"
        component={ProductStack}
        options={{
          // El stack anidado pinta su propio header: si dejáramos el de
          // la pestaña saldrían DOS cabeceras superpuestas.
          headerShown: false,
          tabBarIcon: ({ focused }) => <Icono emoji="🛍️" activo={focused} />,
        }}
      />

      <Tab.Screen
        name="Carrito"
        component={CartScreen}
        options={{
          title: 'Mi carrito',   // texto del header
          tabBarLabel: 'Carrito', // texto de la pestaña: siempre corto
          tabBarIcon: ({ focused }) => <Icono emoji="🛒" activo={focused} />,
          // El badge solo aparece si hay algo dentro
          tabBarBadge: totales.unidades > 0 ? totales.unidades : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
    </Tab.Navigator>
  );
}

/** Icono de pestaña. Usamos emoji para no depender de una librería de iconos. */
function Icono({ emoji, activo }: { emoji: string; activo: boolean }) {
  return <Text style={[styles.icono, !activo && styles.iconoInactivo]}>{emoji}</Text>;
}

/** Alto necesario para icono (26) + etiqueta (14) + respiración */
const ALTO_BARRA = 60;

const styles = StyleSheet.create({
  barra: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  etiqueta: {
    fontSize: 11,
    fontWeight: '600',
  },
  icono: {
    fontSize: 20,
    // lineHeight explícito: sin él, cada plataforma decide una altura
    // distinta para el emoji y la barra descuadra.
    lineHeight: 24,
  },
  iconoInactivo: {
    // La pestaña inactiva se atenúa: refuerza cuál está seleccionada
    opacity: 0.45,
  },
  badge: {
    backgroundColor: colors.error,
    fontSize: 10,
    fontWeight: '700',
  },
});
