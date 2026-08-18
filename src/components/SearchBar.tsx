import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography, TOUCH_TARGET } from '../theme';

interface SearchBarProps {
  valor: string;
  onCambiar: (texto: string) => void;
  placeholder?: string;
}

/**
 * Buscador compacto.
 *
 * No reutilizamos AppTextInput porque aquel lleva etiqueta y espacio
 * reservado para el error: aquí sobran. Un componente reutilizable no
 * debe estirarse hasta servir para todo; a veces dos componentes
 * distintos son más limpios que uno lleno de props opcionales.
 */
export function SearchBar({ valor, onCambiar, placeholder = 'Buscar...' }: SearchBarProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.lupa}>🔍</Text>

      <TextInput
        value={valor}
        onChangeText={onCambiar}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Buscar productos"
      />

      {/* La X solo aparece cuando hay algo que borrar */}
      {valor.length > 0 && (
        <Pressable
          onPress={() => onCambiar('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Borrar búsqueda"
        >
          <Text style={styles.limpiar}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH_TARGET,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  lupa: {
    fontSize: 15,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: spacing.sm + 2,
  },
  limpiar: {
    fontSize: 15,
    color: colors.textDisabled,
    paddingHorizontal: spacing.xs,
  },
});
