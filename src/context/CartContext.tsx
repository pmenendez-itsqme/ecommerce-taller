import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { CartItem, CartTotals, Product } from '../types';
import { calcularTotales, cantidadDe, cartReducer } from '../utils/carrito';

/**
 * ESTADO GLOBAL DEL CARRITO (Context + useReducer)
 *
 * El problema que resuelve: el carrito se modifica desde el Detalle,
 * se muestra en la Home (badge) y se edita en la pantalla del Carrito.
 * Pasar los datos por props de pantalla en pantalla ("prop drilling")
 * sería un desastre.
 *
 * Context = una "tubería" que atraviesa el árbol de componentes.
 * useReducer = toda la lógica de cambios centralizada en cartReducer.
 */

interface CartContextValue {
  items: CartItem[];
  totales: CartTotals;
  agregar: (producto: Product, cantidad?: number) => void;
  quitar: (productoId: string) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  vaciar: () => void;
  /** Unidades de un producto concreto que ya están en el carrito */
  cantidadDeProducto: (productoId: string) => number;
}

/**
 * Arranca en undefined a propósito: así el hook useCart puede detectar
 * si alguien lo usó fuera del Provider y avisar con un error claro
 * en vez de fallar de forma silenciosa.
 */
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  /**
   * useMemo evita crear un objeto nuevo en cada render.
   * Sin él, TODOS los componentes que consumen el contexto se
   * repintarían aunque el carrito no hubiera cambiado.
   */
  const valor = useMemo<CartContextValue>(
    () => ({
      items,
      totales: calcularTotales(items),
      agregar: (producto, cantidad) => dispatch({ type: 'AGREGAR', producto, cantidad }),
      quitar: (productoId) => dispatch({ type: 'QUITAR', productoId }),
      cambiarCantidad: (productoId, cantidad) =>
        dispatch({ type: 'CAMBIAR_CANTIDAD', productoId, cantidad }),
      vaciar: () => dispatch({ type: 'VACIAR' }),
      cantidadDeProducto: (productoId) => cantidadDe(items, productoId),
    }),
    [items]
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

/**
 * Hook para consumir el carrito desde cualquier componente:
 *
 *   const { items, totales, agregar } = useCart();
 *
 * Si se usa fuera del CartProvider, lanza un error explicativo.
 * Es mucho mejor que devolver undefined y provocar un crash
 * incomprensible tres archivos más allá.
 */
export function useCart(): CartContextValue {
  const contexto = useContext(CartContext);

  if (!contexto) {
    throw new Error(
      'useCart() debe usarse dentro de <CartProvider>. ' +
        'Revisa que App.tsx envuelva la aplicación con <CartProvider>.'
    );
  }

  return contexto;
}
