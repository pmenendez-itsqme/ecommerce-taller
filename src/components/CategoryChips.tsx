import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { CATEGORIAS, type Categoria } from '../types';

/** null significa "Todos": no hay filtro de categoría activo */
export type FiltroCategoria = Categoria | null;

interface CategoryChipsProps {
  seleccionada: FiltroCategoria;
  onSeleccionar: (categoria: FiltroCategoria) => void;
}

/**
 * Fila horizontal de categorías.
 *
 * Usa ScrollView horizontal en vez de envolver en varias líneas:
 * así la altura de la cabecera es siempre la misma y el listado
 * no "salta" al cambiar de filtro.
 */
export function CategoryChips({ seleccionada, onSeleccionar }: CategoryChipsProps) {
  // Anteponemos "Todos" (null) al resto de categorías
  const opciones: FiltroCategoria[] = [null, ...CATEGORIAS];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.fila}
    >
      {opciones.map((opcion) => {
        const activa = opcion === seleccionada;

        return (
          <Pressable
            key={opcion ?? 'todos'}
            onPress={() => onSeleccionar(opcion)}
            accessibilityRole="button"
            accessibilityState={{ selected: activa }}
            style={({ pressed }) => [
              styles.chip,
              activa && styles.chipActivo,
              pressed && styles.chipPulsado,
            ]}
          >
            <Text style={[styles.texto, activa && styles.textoActivo]}>
              {opcion ?? 'Todos'}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fila: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipPulsado: {
    opacity: 0.7,
  },
  texto: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  textoActivo: {
    color: colors.textOnPrimary,
  },
});
