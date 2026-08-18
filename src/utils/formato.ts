/**
 * Funciones de formato para mostrar datos al usuario.
 *
 * Van aparte porque son funciones puras y se reutilizan en el listado,
 * el detalle y (en la Etapa 4) el carrito. Si mañana cambias de dólares
 * a otra moneda, se toca UN sitio.
 */

/** 189.9 -> "$189.90" */
export function formatearPrecio(valor: number): string {
  return `$${valor.toFixed(2)}`;
}

/**
 * Calcula el porcentaje de descuento y lo devuelve como texto.
 * Si no hay precio anterior o no hay rebaja real, devuelve null.
 */
export function calcularDescuento(precio: number, precioAnterior?: number): string | null {
  if (!precioAnterior || precioAnterior <= precio) return null;
  const porcentaje = Math.round((1 - precio / precioAnterior) * 100);
  return `-${porcentaje}%`;
}

/**
 * Convierte una valoración numérica en estrellas.
 * 4.7 -> "★★★★★"  ·  4.2 -> "★★★★☆"
 * Se redondea a la media estrella más cercana.
 */
export function estrellas(valoracion: number): string {
  const llenas = Math.round(valoracion);
  return '★'.repeat(llenas) + '☆'.repeat(Math.max(0, 5 - llenas));
}

/**
 * Normaliza texto para poder buscar sin importar tildes ni mayúsculas.
 * "Cámara" y "camara" pasan a ser el mismo texto.
 *
 * normalize('NFD') separa la letra de su tilde, y el reemplazo borra
 * los acentos sueltos (rango Unicode U+0300 a U+036F).
 */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
