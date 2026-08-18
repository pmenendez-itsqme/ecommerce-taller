import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { CategoryChips, type FiltroCategoria } from '../components/CategoryChips';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { PRODUCTOS } from '../data/productos';
import { colors, spacing, typography } from '../theme';
import type { Product } from '../types';
import { normalizarTexto } from '../utils/formato';

interface ProductListScreenProps {
  onSeleccionarProducto: (producto: Product) => void;
}

/**
 * ETAPA 3 — Listado de productos
 *
 * Muestra el catálogo en una cuadrícula de 2 columnas, con buscador
 * y filtro por categoría.
 */
export default function ProductListScreen({
  onSeleccionarProducto,
}: ProductListScreenProps) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState<FiltroCategoria>(null);

  /**
   * Filtrado combinado: categoría Y texto.
   *
   * useMemo evita recalcular el filtro en cada render. Con 10 productos
   * no se nota, pero con 5.000 sí: es el hábito correcto desde el inicio.
   * Solo se recalcula cuando cambia `busqueda` o `categoria`.
   */
  const productosFiltrados = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    return PRODUCTOS.filter((producto) => {
      // 1) ¿Pasa el filtro de categoría? (null = Todos)
      const pasaCategoria = categoria === null || producto.categoria === categoria;
      if (!pasaCategoria) return false;

      // 2) ¿Pasa el filtro de texto? Sin búsqueda, entran todos
      if (texto.length === 0) return true;

      // Buscamos en nombre, resumen y categoría a la vez
      const contenido = normalizarTexto(
        `${producto.nombre} ${producto.resumen} ${producto.categoria}`
      );
      return contenido.includes(texto);
    });
  }, [busqueda, categoria]);

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        // columnWrapperStyle aplica estilos a cada FILA de la cuadrícula
        columnWrapperStyle={styles.fila}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        // La cabecera va DENTRO de la FlatList para que haga scroll
        // junto con los productos en vez de quedarse fija ocupando espacio.
        ListHeaderComponent={
          <View style={styles.cabecera}>
            <Text style={styles.titulo}>Catálogo</Text>

            <SearchBar
              valor={busqueda}
              onCambiar={setBusqueda}
              placeholder="Buscar por nombre o categoría"
            />

            <CategoryChips seleccionada={categoria} onSeleccionar={setCategoria} />

            <Text style={styles.contador}>
              {productosFiltrados.length}{' '}
              {productosFiltrados.length === 1 ? 'producto' : 'productos'}
              {categoria ? ` en ${categoria}` : ''}
            </Text>
          </View>
        }
        // Estado vacío: nunca dejar una pantalla en blanco sin explicación
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.vacioIcono}>🔎</Text>
            <Text style={styles.vacioTitulo}>Sin resultados</Text>
            <Text style={styles.vacioTexto}>
              No encontramos productos para "{busqueda}".{'\n'}
              Prueba con otra palabra o cambia de categoría.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard producto={item} onPress={onSeleccionarProducto} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  cabecera: {
    marginBottom: spacing.md,
    gap: spacing.sm + 2,
  },
  titulo: {
    ...typography.title,
    fontSize: 24,
    color: colors.textPrimary,
  },
  contador: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  fila: {
    gap: spacing.sm + 4,
    marginBottom: spacing.sm + 4,
  },
  vacio: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  vacioIcono: {
    fontSize: 44,
    marginBottom: spacing.sm,
  },
  vacioTitulo: {
    ...typography.label,
    fontSize: 17,
    color: colors.textPrimary,
  },
  vacioTexto: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});
