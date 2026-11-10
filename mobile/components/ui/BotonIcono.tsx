import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colores } from '../../lib/tema';
import { Icono, NombreIcono } from './Icono';

interface Props {
  icono: NombreIcono;
  onPress?: () => void;
  etiqueta: string;
  variante?: 'solido' | 'translucido';
  tamano?: number;
  style?: StyleProp<ViewStyle>;
}

export function BotonIcono({ icono, onPress, etiqueta, variante = 'solido', tamano = 40, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        { width: tamano, height: tamano, borderRadius: tamano / 2 },
        variante === 'solido' ? estilos.solido : estilos.translucido,
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <Icono name={icono} size={Math.round(tamano * 0.5)} color={colores.texto} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  solido: { backgroundColor: colores.elevado, borderWidth: 1, borderColor: colores.borde },
  translucido: { backgroundColor: 'rgba(10,10,15,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
});
