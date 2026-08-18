import type { CartItem, CartTotals, Product } from '../types';

/**
 * LÓGICA PURA DEL CARRITO.
 *
 * Aquí no hay ni un solo componente de React. Son funciones que reciben
 * datos y devuelven datos nuevos, sin modificar los que reciben.
 *
 * ¿Por qué separarlas de la interfaz?
 *  · Se pueden probar sin abrir la app.
 *  · Si mañana cambias la pantalla del carrito, la lógica sigue intacta.
 *  · Un error de cálculo se busca en 60 líneas, no en 400.
 */

/** IVA vigente en Ecuador (15%). Constante: se cambia en un solo sitio. */
export const IVA = 0.15;

/** Redondea a 2 decimales evitando los errores de coma flotante de JS */
function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula el desglose económico del carrito.
 *
 * Ojo con el orden: redondeamos el subtotal ANTES de calcular el IVA.
 * Si no, el total puede salir con un centavo de diferencia respecto a
 * lo que ve el usuario sumando las líneas a mano.
 */
export function calcularTotales(items: CartItem[]): CartTotals {
  const subtotalCrudo = items.reduce(
    (acumulado, item) => acumulado + item.producto.precio * item.cantidad,
    0
  );

  const subtotal = redondear(subtotalCrudo);
  const iva = redondear(subtotal * IVA);
  const total = redondear(subtotal + iva);

  const unidades = items.reduce((acumulado, item) => acumulado + item.cantidad, 0);

  return { subtotal, iva, total, unidades };
}

/** Cuántas unidades de un producto concreto hay en el carrito */
export function cantidadDe(items: CartItem[], productoId: string): number {
  return items.find((i) => i.producto.id === productoId)?.cantidad ?? 0;
}

// ─────────────────────────────────────────────────────────────────────
//  Reducer: TODAS las formas de modificar el carrito viven aquí
// ─────────────────────────────────────────────────────────────────────

export type CartAction =
  | { type: 'AGREGAR'; producto: Product; cantidad?: number }
  | { type: 'QUITAR'; productoId: string }
  | { type: 'CAMBIAR_CANTIDAD'; productoId: string; cantidad: number }
  | { type: 'VACIAR' };

/**
 * Un reducer es una función (estadoActual, acción) => estadoNuevo.
 *
 * Reglas que respeta SIEMPRE:
 *  1. Nunca modifica el arreglo recibido: devuelve uno nuevo (inmutabilidad).
 *     Si mutáramos el original, React no detectaría el cambio y la
 *     pantalla no se repintaría.
 *  2. Nunca deja añadir más unidades de las que hay en stock.
 *  3. Si la cantidad baja a 0, la línea desaparece del carrito.
 */
export function cartReducer(estado: CartItem[], accion: CartAction): CartItem[] {
  switch (accion.type) {
    case 'AGREGAR': {
      const { producto } = accion;
      const cantidadPedida = accion.cantidad ?? 1;

      // Un producto agotado nunca entra al carrito
      if (producto.stock <= 0) return estado;

      const existente = estado.find((i) => i.producto.id === producto.id);

      if (!existente) {
        const cantidad = Math.min(cantidadPedida, producto.stock);
        return [...estado, { producto, cantidad }];
      }

      // Ya estaba: sumamos, pero sin pasarnos del stock
      const nuevaCantidad = Math.min(existente.cantidad + cantidadPedida, producto.stock);

      return estado.map((item) =>
        item.producto.id === producto.id ? { ...item, cantidad: nuevaCantidad } : item
      );
    }

    case 'QUITAR':
      return estado.filter((item) => item.producto.id !== accion.productoId);

    case 'CAMBIAR_CANTIDAD': {
      // Bajar a 0 (o menos) equivale a eliminar la línea
      if (accion.cantidad <= 0) {
        return estado.filter((item) => item.producto.id !== accion.productoId);
      }

      return estado.map((item) =>
        item.producto.id === accion.productoId
          ? { ...item, cantidad: Math.min(accion.cantidad, item.producto.stock) }
          : item
      );
    }

    case 'VACIAR':
      return [];

    default:
      // TypeScript garantiza que nunca llegamos aquí si cubrimos
      // todos los casos del union type CartAction.
      return estado;
  }
}
