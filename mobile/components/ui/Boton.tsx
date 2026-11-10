import { ActivityIndicator, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colores, radio } from '../../lib/tema';
import { Icono, NombreIcono } from './Icono';
import { Texto } from './Texto';

type Variante = 'primario' | 'secundario' | 'fantasma' | 'claro';

interface Props {
  titulo: string;
  onPress?: () => void;
  variante?: Variante;
  icono?: NombreIcono;
  deshabilitado?: boolean;
  cargando?: boolean;
  tamano?: 'm' | 'l' | 's';
  style?: StyleProp<ViewStyle>;
}

const FONDOS: Record<Variante, string> = {
  primario: colores.primario,
  secundario: colores.elevado,
  fantasma: 'transparent',
  claro: '#FFFFFF',
};

export function Boton({ titulo, onPress, variante = 'primario', icono, deshabilitado, cargando, tamano = 'm', style }: Props) {
  const colorTexto = variante === 'primario' ? '#FFFFFF' : colores.texto;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: !!deshabilitado, busy: !!cargando }}
      disabled={deshabilitado || cargando}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        estilos[tamano],
        { backgroundColor: FONDOS[variante] },
        variante === 'secundario' && estilos.borde,
        deshabilitado && estilos.deshabilitado,
        pressed && estilos.presionado,
        style,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <>
          {icono && <Icono name={icono} size={tamano === 's' ? 16 : 18} color={colorTexto} />}
          <Texto variante={tamano === 's' ? 'pequenoFuerte' : 'boton'} color={colorTexto} numberOfLines={1}>
            {titulo}
          </Texto>
        </>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radio.m,
    paddingHorizontal: 18,
  },
  s: { height: 38, paddingHorizontal: 14, borderRadius: radio.s + 2 },
  m: { height: 48 },
  l: { height: 48 },
  borde: { borderWidth: 1, borderColor: colores.bordeFuerte },
  deshabilitado: { opacity: 0.4 },
  presionado: { opacity: 0.8 },
});
