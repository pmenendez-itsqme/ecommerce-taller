import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface ProductImageProps {
  uri: string;
  /** Color de fondo si la imagen no carga */
  colorRespaldo: string;
  /** Emoji que se muestra si la imagen no carga */
  iconoRespaldo: string;
  /** Tamaño del emoji de respaldo */
  tamanoIcono?: number;
  style?: ViewStyle;
}

/**
 * Imagen de producto con los tres estados que SIEMPRE hay que contemplar
 * al cargar algo de internet:
 *
 *   1. Cargando  -> spinner sobre un fondo neutro
 *   2. Correcta  -> la foto
 *   3. Fallida   -> color de marca + emoji, nunca un hueco roto
 *
 * Olvidar el estado 3 es el error más común al usar imágenes remotas:
 * basta con que el usuario esté sin datos para que la tienda se vea rota.
 */
export function ProductImage({
  uri,
  colorRespaldo,
  iconoRespaldo,
  tamanoIcono = 40,
  style,
}: ProductImageProps) {
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState(false);

  if (fallo) {
    return (
      <View style={[styles.contenedor, { backgroundColor: colorRespaldo }, style]}>
        <Text style={{ fontSize: tamanoIcono }}>{iconoRespaldo}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.contenedor, style]}>
      <Image
        source={{ uri }}
        style={styles.imagen}
        resizeMode="cover"
        onLoadEnd={() => setCargando(false)}
        onError={() => {
          setFallo(true);
          setCargando(false);
        }}
        accessibilityIgnoresInvertColors
      />

      {cargando && (
        <View style={styles.spinner}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  spinner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border,
  },
});
