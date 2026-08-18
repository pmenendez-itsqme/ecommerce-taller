import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { RootNavigator } from './src/navigation/RootNavigator';

/**
 * ETAPA 5 — Raíz de la aplicación.
 *
 * App ya no decide qué pantalla mostrar: solo monta los "proveedores"
 * y delega la navegación en RootNavigator.
 *
 * El ORDEN de anidamiento importa:
 *   SafeAreaProvider  -> mide muescas y barras del sistema
 *     AuthProvider    -> quién es el usuario
 *       CartProvider  -> qué lleva en el carrito
 *         RootNavigator -> qué pantalla ve
 *
 * Cada proveedor debe envolver a todo el que necesite sus datos.
 * RootNavigator va el último porque necesita a los tres.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
