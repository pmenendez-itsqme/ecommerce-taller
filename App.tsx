import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TopBar } from './src/components/TopBar';
import { CartProvider, useCart } from './src/context/CartContext';
import CartScreen from './src/screens/CartScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import { colors } from './src/theme';
import type { Product, User } from './src/types';

/** Pantallas disponibles tras iniciar sesión */
type Pantalla = 'home' | 'listado' | 'detalle' | 'carrito';

/**
 * ETAPAS 1 a 4 — Raíz de la aplicación.
 *
 * App solo se encarga de montar el CartProvider. Toda la lógica de
 * pantallas vive en <Contenido>, que ya está DENTRO del provider y
 * por tanto puede usar useCart().
 *
 * En la Etapa 5 la navegación casera se reemplaza por React Navigation.
 */
export default function App() {
  return (
    <CartProvider>
      <Contenido />
    </CartProvider>
  );
}

function Contenido() {
  const [user, setUser] = useState<User | null>(null);
  const [pantalla, setPantalla] = useState<Pantalla>('home');
  const [productoActivo, setProductoActivo] = useState<Product | null>(null);

  // El carrito es global: lo leemos aquí para el badge y el contador
  const { totales, vaciar } = useCart();

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
    setPantalla('home');
    setProductoActivo(null);
    // El carrito pertenece al usuario: al salir se vacía.
    // Si quisieras conservarlo, aquí NO llamarías a vaciar().
    vaciar();
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
          onVerCarrito={() => setPantalla('carrito')}
          itemsEnCarrito={totales.unidades}
        />
      )}

      {pantalla === 'listado' && (
        <>
          <TopBar
            titulo="Productos"
            onVolver={() => setPantalla('home')}
            onAbrirCarrito={() => setPantalla('carrito')}
            unidadesCarrito={totales.unidades}
          />
          <ProductListScreen onSeleccionarProducto={abrirDetalle} />
        </>
      )}

      {pantalla === 'detalle' && productoActivo && (
        <>
          <TopBar
            titulo={productoActivo.nombre}
            onVolver={() => setPantalla('listado')}
            onAbrirCarrito={() => setPantalla('carrito')}
            unidadesCarrito={totales.unidades}
          />
          <ProductDetailScreen producto={productoActivo} />
        </>
      )}

      {pantalla === 'carrito' && (
        <>
          <TopBar titulo="Carrito" onVolver={() => setPantalla('home')} />
          <CartScreen onSeguirComprando={() => setPantalla('listado')} />
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
