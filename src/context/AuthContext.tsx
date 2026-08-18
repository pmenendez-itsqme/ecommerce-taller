import React, { createContext, useContext, useMemo, useState } from 'react';
import type { User } from '../types';

/**
 * ESTADO GLOBAL DE SESIÓN.
 *
 * Hasta la Etapa 4 el usuario vivía en un useState dentro de App.tsx y se
 * pasaba por props. Con React Navigation eso ya no sirve: las pantallas
 * las instancia el navegador, no nosotros, así que no podemos pasarles
 * props a mano. La solución es la misma que usamos para el carrito.
 */

interface AuthContextValue {
  user: User | null;
  /** true cuando hay sesión iniciada */
  autenticado: boolean;
  iniciarSesion: (user: User) => void;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const valor = useMemo<AuthContextValue>(
    () => ({
      user,
      autenticado: user !== null,
      iniciarSesion: setUser,
      cerrarSesion: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      'useAuth() debe usarse dentro de <AuthProvider>. Revisa App.tsx.'
    );
  }

  return contexto;
}
