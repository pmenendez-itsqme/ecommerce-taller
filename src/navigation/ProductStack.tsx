import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { obtenerProductoPorId } from '../data/productos';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListScreen from '../screens/ProductListScreen';
import { colors } from '../theme';
import type { ProductStackParamList } from './types';

const Stack = createNativeStackNavigator<ProductStackParamList>();

/**
 * Stack anidado dentro de la pestaña "Productos".
 *
 * ¿Por qué un Stack dentro de una pestaña? Porque el detalle debe
 * apilarse SOBRE el listado: así el usuario puede volver con el gesto
 * de deslizar o con el botón físico de Android, y la barra de pestañas
 * sigue visible todo el tiempo.
 */
export function ProductStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.textPrimary, fontSize: 16 },
        headerShadowVisible: false,
        // Animación nativa de iOS/Android al apilar pantallas
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Listado"
        component={ProductListScreen}
        options={{ title: 'Catálogo' }}
      />

      <Stack.Screen
        name="Detalle"
        component={ProductDetailScreen}
        // El título del header sale del propio parámetro de la ruta:
        // así cada producto muestra su nombre sin escribirlo a mano.
        options={({ route }) => ({
          title: obtenerProductoPorId(route.params.productoId)?.nombre ?? 'Detalle',
          headerBackTitle: 'Atrás',
        })}
      />
    </Stack.Navigator>
  );
}
