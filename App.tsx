import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TopBar } from './src/components/TopBar';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import { colors } from './src/theme';
import type { Product, User } from './src/types';

/** Pantallas disponibles tras iniciar sesión */
type Pantalla = 'home' | 'listado' | 'detalle';

/**
 * ETAPAS 1 a 3 — Raíz de la aplicación.
 *
 * La navegación sigue siendo "casera" (useState). En la Etapa 5 la
 * sustituiremos por React Navigation, que además dará el gesto de
 * deslizar para volver y el historial del botón físico de Android.
 */
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [pantalla, setPantalla] = useState<Pantalla>('home');

  /** Producto que el usuario abrió desde el listado */
  const [productoActivo, setProductoActivo] = useState<Product | null>(null);

  // Sin sesión no hay nada más que mostrar
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <LoginScreen onLoginSuccess={setUser} />
      </SafeAreaView>
    );
  }

  const cerrarSesion = () => {
    setUser(null);
    // Importante: volvemos al estado inicial. Si no, al entrar el
    // siguiente usuario aparecería la pantalla donde lo dejó el anterior.
    setPantalla('home');
    setProductoActivo(null);
  };

  const abrirDetalle = (producto: Product) => {
    setProductoActivo(producto);
    setPantalla('detalle');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {pantalla === 'home' && (
        <HomeScreen
          user={user}
          onLogout={cerrarSesion}
          onVerProductos={() => setPantalla('listado')}
          // onVerCarrito llegará en la Etapa 4
        />
      )}

      {pantalla === 'listado' && (
        <>
          <TopBar titulo="Productos" onVolver={() => setPantalla('home')} />
          <ProductListScreen onSeleccionarProducto={abrirDetalle} />
        </>
      )}

      {pantalla === 'detalle' && productoActivo && (
        <>
          <TopBar titulo={productoActivo.nombre} onVolver={() => setPantalla('listado')} />
          <ProductDetailScreen producto={productoActivo} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
