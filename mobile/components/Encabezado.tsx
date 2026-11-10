import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colores } from '../lib/tema';
import { BotonIcono } from './ui/BotonIcono';
import { Texto } from './ui/Texto';

export function regresar() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

interface Props {
  titulo: string;
  subtitulo?: string;
  derecha?: ReactNode;
  onRegresar?: () => void;
}

/** Barra superior de las pantallas internas (asientos, confirmar compra...). */
export function Encabezado({ titulo, subtitulo, derecha, onRegresar = regresar }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[estilos.base, { paddingTop: insets.top + 8 }]}>
      <BotonIcono icono="chevron-back" etiqueta="Regresar" onPress={onRegresar} />
      <View style={{ flex: 1 }}>
        <Texto variante="subtitulo" numberOfLines={1}>
          {titulo}
        </Texto>
        {subtitulo ? (
          <Texto variante="pequeno" color={colores.tenue} numberOfLines={1}>
            {subtitulo}
          </Texto>
        ) : null}
      </View>
      {derecha}
    </View>
  );
}

const estilos = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colores.fondo,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
  },
});
