import { useEffect } from 'react';
import { Platform } from 'react-native';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { BoletosProvider } from '../lib/boletos';
import { CineProvider } from '../lib/cine';
import { colores } from '../lib/tema';

SplashScreen.preventAutoHideAsync().catch(() => {});

const tema = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colores.primario,
    background: colores.fondo,
    card: colores.superficie,
    text: colores.texto,
    border: colores.borde,
  },
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = colores.fondo;
    }
  }, []);

  return (
    <ThemeProvider value={tema}>
      <CineProvider>
        <BoletosProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colores.fondo },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="pelicula/[id]" />
            <Stack.Screen name="asientos/[funcion]" />
            <Stack.Screen name="confirmar" />
            <Stack.Screen name="boleto/[id]" options={{ animation: 'slide_from_bottom' }} />
          </Stack>
        </BoletosProvider>
      </CineProvider>
    </ThemeProvider>
  );
}
