import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colores } from '../lib/tema';
import { Contenedor } from './ui/Contenedor';

/** Barra fija en la parte inferior (total + botón de acción). */
export function BarraInferior({ children, ancho = 640 }: { children: ReactNode; ancho?: number }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[estilos.base, { paddingBottom: insets.bottom + 12 }]}>
      <Contenedor ancho={ancho} style={estilos.contenido}>
        {children}
      </Contenedor>
    </View>
  );
}

const estilos = StyleSheet.create({
  base: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    backgroundColor: 'rgba(19,19,26,0.97)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.bordeFuerte,
  },
  contenido: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16 },
});
