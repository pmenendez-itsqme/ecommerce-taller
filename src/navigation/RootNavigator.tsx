import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * NAVEGADOR RAÍZ — patrón de "flujos protegidos".
 *
 * Fíjate en que NO usamos navigation.navigate('Principal') tras el login.
 * En su lugar declaramos condicionalmente qué pantallas EXISTEN:
 *
 *   sin sesión  -> solo existe Login
 *   con sesión  -> solo existe Principal
 *
 * Ventajas sobre navegar a mano:
 *  · Es imposible llegar a la app sin sesión, ni con el botón "atrás".
 *  · Al cerrar sesión, el historial se destruye solo.
 *  · React Navigation anima la transición automáticamente.
 */
export function RootNavigator() {
  const { autenticado } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {autenticado ? (
          <Stack.Screen name="Principal" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
