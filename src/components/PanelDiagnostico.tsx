import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BUILD_ID } from '../config';
import { diagnosticar, listarCorreosMock } from '../services/authService';
import { colors, radius, spacing, typography } from '../theme';
import { detectarInvisibles, mostrarTexto } from '../utils/inspeccionar';

interface PanelDiagnosticoProps {
  email: string;
  password: string;
}

/**
 * Panel de diagnóstico del taller.
 *
 * Muestra EN PANTALLA lo que normalmente habría que buscar en la consola
 * de Metro. En un aula con 30 estudiantes y teléfonos distintos, esto
 * resuelve en 5 segundos lo que por terminal cuesta media clase.
 *
 * Va envuelto en __DEV__ dentro de LoginScreen, así que NO aparece
 * en una compilación de producción.
 */
export function PanelDiagnostico({ email, password }: PanelDiagnosticoProps) {
  const [abierto, setAbierto] = useState(false);

  const correos = listarCorreosMock();
  const resultado = diagnosticar(email, password);

  const invisiblesEmail = detectarInvisibles(email);
  const invisiblesPassword = detectarInvisibles(password);

  /** Traduce el motivo técnico a una instrucción concreta */
  const explicacion = (): { texto: string; ok: boolean } => {
    if (!email && !password) {
      return { texto: 'Escribe correo y contraseña para ver el diagnóstico.', ok: true };
    }
    switch (resultado.motivo) {
      case 'ok':
        return { texto: '✓ Estas credenciales SÍ son válidas. El login debe funcionar.', ok: true };
      case 'correo-no-existe':
        return {
          texto:
            '✗ Ese correo NO está en la lista de arriba.\n' +
            '→ Si acabas de añadirlo al archivo, Metro está sirviendo código antiguo.\n' +
            '→ Detén Expo y arranca con: npx expo start --clear',
          ok: false,
        };
      case 'password-solo-espacios':
        return {
          texto:
            '✗ La contraseña tiene ESPACIOS invisibles sobrantes.\n' +
            '→ El autocorrector del teclado los añadió. Bórralos y vuelve a escribirla.',
          ok: false,
        };
      default:
        return {
          texto:
            '✗ El correo existe, pero la contraseña no coincide.\n' +
            `→ Esperada: ${mostrarTexto(resultado.passwordEsperada ?? '')}`,
          ok: false,
        };
    }
  };

  const { texto, ok } = explicacion();

  if (!abierto) {
    return (
      <Pressable onPress={() => setAbierto(true)} style={styles.toggle} hitSlop={8}>
        <Text style={styles.toggleTexto}>Abrir diagnóstico · build {BUILD_ID}</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.panel}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>Diagnóstico · build {BUILD_ID}</Text>
        <Pressable onPress={() => setAbierto(false)} hitSlop={8}>
          <Text style={styles.cerrar}>Cerrar</Text>
        </Pressable>
      </View>

      <Fila etiqueta="Usuarios cargados" valor={correos.join('\n')} />
      <Fila etiqueta="Correo escrito" valor={mostrarTexto(email)} />
      {invisiblesEmail.length > 0 && (
        <Fila etiqueta="⚠ En el correo hay" valor={invisiblesEmail.join(', ')} alerta />
      )}
      <Fila etiqueta="Contraseña escrita" valor={mostrarTexto(password)} />
      {invisiblesPassword.length > 0 && (
        <Fila etiqueta="⚠ En la contraseña hay" valor={invisiblesPassword.join(', ')} alerta />
      )}

      <View style={[styles.veredicto, ok ? styles.veredictoOk : styles.veredictoError]}>
        <Text style={[styles.veredictoTexto, ok ? styles.textoOk : styles.textoError]}>
          {texto}
        </Text>
      </View>
    </View>
  );
}

function Fila({
  etiqueta,
  valor,
  alerta = false,
}: {
  etiqueta: string;
  valor: string;
  alerta?: boolean;
}) {
  return (
    <View style={styles.fila}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={[styles.valor, alerta && styles.valorAlerta]}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  toggleTexto: {
    ...typography.caption,
    color: colors.textDisabled,
    textDecorationLine: 'underline',
  },
  panel: {
    marginTop: spacing.md,
    backgroundColor: '#0F172A',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titulo: {
    ...typography.caption,
    fontWeight: '700',
    color: '#7DD3FC',
  },
  cerrar: {
    ...typography.caption,
    color: '#94A3B8',
  },
  fila: {
    marginBottom: spacing.sm,
  },
  etiqueta: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  valor: {
    fontSize: 12,
    color: '#E2E8F0',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  valorAlerta: {
    color: '#FCA5A5',
    fontWeight: '700',
  },
  veredicto: {
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
    marginTop: spacing.xs,
  },
  veredictoOk: {
    backgroundColor: '#052E1B',
  },
  veredictoError: {
    backgroundColor: '#3F1212',
  },
  veredictoTexto: {
    fontSize: 12,
    lineHeight: 18,
  },
  textoOk: {
    color: '#86EFAC',
  },
  textoError: {
    color: '#FCA5A5',
  },
});
