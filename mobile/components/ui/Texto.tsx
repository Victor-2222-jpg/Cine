import { StyleSheet, Text, TextProps } from 'react-native';
import { colores } from '../../lib/tema';

export type VarianteTexto =
  | 'display'
  | 'titulo'
  | 'subtitulo'
  | 'cuerpo'
  | 'cuerpoFuerte'
  | 'pequeno'
  | 'pequenoFuerte'
  | 'etiqueta'
  | 'boton';

interface Props extends TextProps {
  variante?: VarianteTexto;
  color?: string;
}

/** Texto con la tipografía del sistema de diseño (Inter). */
export function Texto({ variante = 'cuerpo', color = colores.texto, style, ...props }: Props) {
  return <Text {...props} style={[estilos[variante], { color }, style]} />;
}

const estilos = StyleSheet.create({
  display: { fontSize: 24, fontWeight: 'bold' },
  titulo: { fontSize: 20, fontWeight: 'bold' },
  subtitulo: { fontSize: 17, fontWeight: 'bold' },
  cuerpo: { fontSize: 15 },
  cuerpoFuerte: { fontSize: 15, fontWeight: 'bold' },
  pequeno: { fontSize: 13 },
  pequenoFuerte: { fontSize: 13, fontWeight: 'bold' },
  etiqueta: { fontSize: 12, fontWeight: 'bold' },
  boton: { fontSize: 15, fontWeight: 'bold' },
});
