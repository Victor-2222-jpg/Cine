import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ANCHO_MAXIMO } from '../../lib/tema';

/** Limita el ancho del contenido y lo centra (se nota en web y tablets). */
export function Contenedor({ children, style, ancho = ANCHO_MAXIMO }: { children: ReactNode; style?: StyleProp<ViewStyle>; ancho?: number }) {
  return <View style={[{ width: '100%', maxWidth: ancho, alignSelf: 'center' }, style]}>{children}</View>;
}
