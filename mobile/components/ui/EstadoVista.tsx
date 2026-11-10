import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colores } from '../../lib/tema';
import { Boton } from './Boton';
import { Icono, NombreIcono } from './Icono';
import { Texto } from './Texto';

interface Props {
  icono: NombreIcono;
  titulo: string;
  mensaje?: string;
  accion?: { titulo: string; onPress: () => void; icono?: NombreIcono };
  compacto?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Pantalla/sección de estado: error, vacío, sin resultados... */
export function EstadoVista({ icono, titulo, mensaje, accion, compacto, style }: Props) {
  return (
    <View style={[estilos.contenedor, compacto ? estilos.compacto : estilos.completo, style]}>
      <View style={estilos.icono}>
        <Icono name={icono} size={30} color={colores.secundario} />
      </View>
      <Texto variante="subtitulo" style={estilos.centrado}>
        {titulo}
      </Texto>
      {mensaje ? (
        <Texto variante="pequeno" color={colores.tenue} style={[estilos.centrado, { maxWidth: 340 }]}>
          {mensaje}
        </Texto>
      ) : null}
      {accion ? (
        <Boton titulo={accion.titulo} icono={accion.icono} onPress={accion.onPress} tamano="s" style={{ marginTop: 8 }} />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 24 },
  completo: { flex: 1, backgroundColor: colores.fondo },
  compacto: { paddingVertical: 40 },
  icono: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colores.elevado,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  centrado: { textAlign: 'center' },
});
