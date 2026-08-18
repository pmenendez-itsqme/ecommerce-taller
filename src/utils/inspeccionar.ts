/**
 * Utilidades para hacer VISIBLE lo invisible.
 *
 * El 90% de los bugs de "pero si está bien escrito" son caracteres que
 * el ojo no ve: espacios al final, espacios duros ( ) que insertan
 * algunos teclados, tabuladores o saltos de línea.
 */

/** Nombre legible de los caracteres invisibles más comunes */
const NOMBRES_INVISIBLES: Record<number, string> = {
  9: 'TAB',
  10: 'SALTO',
  13: 'RETORNO',
  32: 'ESPACIO',
  160: 'ESPACIO DURO',
  8203: 'ESPACIO CERO',
};

/**
 * Devuelve el texto entre comillas y con su longitud, igual que hace
 * JSON.stringify: así un espacio al final se ve como `"hola "` en vez de `hola`.
 */
export function mostrarTexto(texto: string): string {
  return `${JSON.stringify(texto)} (${texto.length} car.)`;
}

/**
 * Lista los caracteres invisibles que contiene un texto.
 * Devuelve [] si el texto está limpio.
 */
export function detectarInvisibles(texto: string): string[] {
  const hallazgos: string[] = [];

  [...texto].forEach((caracter, indice) => {
    const codigo = caracter.charCodeAt(0);
    const nombre = NOMBRES_INVISIBLES[codigo];
    // Reportamos los espacios solo si están al principio o al final:
    // un espacio en medio de un nombre es legítimo.
    const enBorde = indice === 0 || indice === texto.length - 1;

    if (nombre && (codigo !== 32 || enBorde)) {
      hallazgos.push(`${nombre} en posición ${indice + 1}`);
    }
  });

  return hallazgos;
}
