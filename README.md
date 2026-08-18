# Taller de Aplicación Móvil — E-commerce con React Native

Aplicación de comercio electrónico construida con **React Native + Expo + TypeScript**.
El proyecto se desarrolla en **5 etapas**, y cada etapa termina con un commit a GitHub.

> **Expo SDK 54** — versión elegida a propósito porque es la última compatible con
> la app **Expo Go** que se descarga de Google Play y de la App Store.
> Ver la sección [Solución de problemas](#solución-de-problemas) antes de cambiar de SDK.

---

## Progreso del taller

| Etapa | Contenido | Estado |
|-------|-----------|--------|
| 1 | Configuración inicial y pantalla de Login | ✅ Completada |
| 2 | Pantalla de Inicio (Home) | ✅ Completada |
| 3 | Listado y detalle de productos | ✅ Completada |
| 4 | Lógica del carrito y estado global | ✅ Completada |
| 5 | Navegación completa y pulido de UX | ✅ Completada |

---

## Cómo ejecutar el proyecto

```bash
npm install
npx expo start
```

Luego escanea el código QR con la app **Expo Go** en tu teléfono,
o pulsa `a` (Android), `i` (iOS) o `w` (web) en la terminal.

### Las tres plataformas

Un mismo código fuente corre en Android, iOS y navegador:

```bash
npm run start     # menú: pulsa a / i / w
npm run web       # abre directamente en el navegador
npm run android   # emulador o dispositivo Android
```

Para publicar la versión web como sitio estático:

```bash
npx expo export --platform web    # genera la carpeta dist/
```

La carpeta `dist/` es HTML+JS puro: se sube tal cual a GitHub Pages, Netlify o Vercel.

### Credenciales de prueba

| Correo | Contraseña |
|--------|-----------|
| `estudiante@taller.com` | `123456` |
| `pablo@taller.com` | `taller2026` |

---

## Estructura de carpetas

```
ecommerce-taller/
├── App.tsx                  # Raíz de la app
├── index.ts                 # Punto de entrada (registerRootComponent)
├── app.json                 # Configuración de Expo
├── tsconfig.json            # Configuración de TypeScript (modo strict)
└── src/
    ├── components/          # 10 componentes reutilizables
    ├── screens/             # Login, Home, Listado, Detalle, Carrito
    ├── navigation/          # RootNavigator, MainTabs, ProductStack, types
    ├── context/             # AuthContext y CartContext (estado global)
    ├── data/                # Catálogo simulado de productos
    ├── services/            # Acceso a datos / API (authService)
    ├── theme/               # Colores, espaciado y tipografía
    ├── types/               # Interfaces y tipos de TypeScript
    └── utils/               # validators, carrito, formato, inspeccionar
```

**Por qué esta estructura:** cada carpeta tiene una única responsabilidad.
Cuando la app crezca a 5 pantallas seguirás sabiendo dónde está cada cosa,
y podrás cambiar el login mock por una API real tocando **un solo archivo**
(`src/services/authService.ts`).

---

## Etapa 1 — Qué se implementó

### Sistema de diseño (`src/theme/`)
Ningún componente escribe un color o un margen "a mano". Todo sale del theme,
así que cambiar la identidad visual de la app entera es editar un archivo.

### Componentes reutilizables (`src/components/`)
- **`AppTextInput`** — campo con etiqueta visible, 3 estados (normal / enfocado / error),
  botón *Mostrar / Ocultar* para contraseñas y espacio reservado para el mensaje de error.
- **`AppButton`** — 3 variantes (primary / secondary / ghost), estado de carga con spinner
  y bloqueo automático mientras carga.

### Pantalla de Login (`src/screens/LoginScreen.tsx`)
- Validación de correo y contraseña con feedback claro en español.
- Autenticación simulada con latencia de red para poder ver el spinner.
- Manejo de teclado, salto entre campos y accesibilidad.

---

## Decisiones de UX aplicadas en la Etapa 1

| # | Decisión | Por qué importa |
|---|----------|-----------------|
| 1 | **Validar al salir del campo, no al teclear** | Mostrar "correo inválido" tras la primera letra es agresivo y frustra al usuario. Usamos un estado `touched`. |
| 2 | **Etiqueta visible sobre el campo** | El placeholder desaparece al escribir y el usuario olvida qué campo era. |
| 3 | **Espacio reservado para el error** | Si el error aparece de golpe, el formulario "salta" y el usuario pierde el sitio. |
| 4 | **Botón deshabilitado + spinner** | Impide el doble envío y comunica que algo está ocurriendo. |
| 5 | **Área táctil mínima de 48dp** | Guías de accesibilidad de Apple (44pt) y Material Design (48dp). |
| 6 | **Teclado adecuado por campo** | `keyboardType="email-address"` muestra la tecla `@` directamente. |
| 7 | **Salto automático entre campos** | `returnKeyType="next"` + `ref` lleva del correo a la contraseña sin tocar la pantalla. |
| 8 | **Error de login genérico** | "Correo o contraseña incorrectos" no revela si el correo existe (evita enumeración de usuarios). |
| 9 | **Mostrar / ocultar contraseña** | Reduce muchísimo los errores de tecleo en móvil. |
| 10 | **`KeyboardAvoidingView` + `ScrollView`** | El teclado no tapa el botón de enviar en pantallas pequeñas. |
| 11 | **`width: '100%'` + `maxWidth: 440`** | Una sola regla sirve para teléfono, tablet y monitor: el formulario nunca se estira a lo ancho. |
| 12 | **`autoCorrect={false}` forzado en contraseñas** | El autocorrector de Android añade espacios invisibles y rompe el login. |

---

## Verificación de la Etapa 1

```bash
npm run typecheck   # TypeScript en modo strict: 0 errores
npx expo start      # La app arranca en Expo Go
```

**Lista de comprobación manual:**

- [ ] Pulsar "Iniciar sesión" con el formulario vacío muestra los dos errores.
- [ ] Escribir `abc` en el correo y salir del campo muestra "Ingresa un correo válido".
- [ ] Una contraseña de 5 caracteres muestra el error de longitud mínima.
- [ ] "Mostrar / Ocultar" alterna la visibilidad de la contraseña.
- [ ] Con credenciales incorrectas aparece el aviso rojo del servidor.
- [ ] Con `estudiante@taller.com` / `123456` aparece la pantalla de éxito.
- [ ] Durante la carga el botón muestra el spinner y no se puede pulsar dos veces.

---

## Solución de problemas

### `Project is incompatible with this version of Expo Go`

Significa que la versión del **SDK del proyecto** (el paquete `expo` en `package.json`)
no coincide con la versión de **Expo Go** instalada en el teléfono.

Desde mayo de 2026, la app Expo Go publicada en **Google Play y la App Store se quedó
en el SDK 54**. Los SDK 55, 56 y 57 no se distribuyen por las tiendas: requieren
un *development build* o un APK firmado aparte. Por eso este taller usa **SDK 54**:
basta con instalar Expo Go desde la tienda y funciona.

Si alguna vez vuelves a ver el error, comprueba la versión del proyecto:

```bash
npx expo-doctor@latest      # diagnóstico completo
npx expo install --check    # lista paquetes con versión incorrecta
npx expo install --fix      # los alinea con el SDK del proyecto
```

Y si tocaste `package.json` a mano, vuelve a un estado limpio:

```bash
rm -rf node_modules package-lock.json .expo
npm install
npx expo start --clear
```

### `1 package may need updating`

Es un aviso, no un error: algún paquete no está en la versión que ese SDK espera.
Se corrige con `npx expo install --fix`.

### Alternativas si Expo Go sigue fallando

| Opción | Cuándo usarla |
|--------|---------------|
| `npx expo start --web` | Ver la app en el navegador ahora mismo, sin teléfono |
| Emulador de Android Studio | Ya tienes el emulador configurado |
| Development build (`npx expo run:android`) | Necesitas un SDK superior al 54 |

---

## Autor

Taller de Desarrollo de Aplicaciones Móviles.


---

## Arquitectura de navegación (Etapa 5)

```
SafeAreaProvider
└── AuthProvider          ← quién es el usuario
    └── CartProvider      ← qué lleva en el carrito
        └── RootNavigator (Stack)
            ├── sin sesión → Login
            └── con sesión → MainTabs (pestañas inferiores)
                             ├── Inicio    → HomeScreen
                             ├── Productos → ProductStack (Stack anidado)
                             │               ├── Listado
                             │               └── Detalle  { productoId }
                             └── Carrito   → CartScreen  (con badge)
```

**Flujos protegidos:** el RootNavigator no navega a mano tras el login.
Declara condicionalmente qué pantallas *existen*, así es imposible entrar
sin sesión ni siquiera con el botón "atrás".

**Parámetros serializables:** al Detalle se le pasa `{ productoId }`, no el
objeto del producto. Es lo que exige React Navigation para poder guardar
y restaurar el estado de navegación.

## Estado global

| Contexto | Qué guarda | Hook |
|----------|-----------|------|
| `AuthContext` | Usuario con sesión iniciada | `useAuth()` |
| `CartContext` | Líneas del carrito y totales | `useCart()` |

La lógica del carrito vive en `src/utils/carrito.ts` como funciones puras
(`calcularTotales`, `cartReducer`), separada de la interfaz para poder
probarla sin abrir la aplicación.
