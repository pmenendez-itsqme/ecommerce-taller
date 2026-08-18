/**
 * TIPADO DE LA NAVEGACIÓN.
 *
 * Cada "ParamList" declara qué pantallas existen y qué parámetros acepta
 * cada una. `undefined` significa "esta pantalla no recibe parámetros".
 *
 * Gracias a esto TypeScript te avisa si escribes mal el nombre de una
 * pantalla o si olvidas un parámetro obligatorio. Es la razón principal
 * para usar TypeScript con React Navigation.
 */

/** Stack raíz: decide entre login y aplicación */
export type RootStackParamList = {
  Login: undefined;
  Principal: undefined;
};

/** Pestañas inferiores de la aplicación */
export type MainTabParamList = {
  Inicio: undefined;
  Productos: undefined;
  Carrito: undefined;
};

/**
 * Stack anidado dentro de la pestaña "Productos".
 *
 * Pasamos el ID del producto, NO el objeto completo: React Navigation
 * pide que los parámetros sean serializables (texto, números, booleanos)
 * para poder guardar y restaurar el estado de navegación.
 */
export type ProductStackParamList = {
  Listado: undefined;
  Detalle: { productoId: string };
};
