import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Pelicula } from '../lib/api';
import { duracion } from '../lib/formato';
import { Sala } from '../lib/simulacion';
import { colores } from '../lib/tema';
import { PosterImagen } from './PosterImagen';
import { Texto } from './ui/Texto';

interface Props {
  pelicula: Pelicula;
  sala?: Sala;
  /** Hora de la próxima función de hoy, ej. "19:30" */
  proxima?: string | null;
}

export function TarjetaPelicula({ pelicula, sala, proxima }: Props) {
  const categoria = pelicula.categoria?.Categoria ?? 'Sin categoría';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/pelicula/${pelicula.Identificador}`)}
      style={({ pressed }) => [estilos.tarjeta, pressed && { opacity: 0.7 }]}
    >
      <PosterImagen pelicula={pelicula} style={{ width: 70 }} redondeo={0} />
      <View style={{ flex: 1, gap: 2 }}>
        <Texto variante="cuerpoFuerte">{pelicula.Titulo}</Texto>
        <Texto variante="pequeno" color={colores.secundario}>
          {categoria} - {duracion(pelicula.Duracion)}
        </Texto>
        {sala ? (
          <Texto variante="pequeno" color={colores.secundario}>
            {sala.nombre} ({sala.tipo})
          </Texto>
        ) : null}
        {proxima ? (
          <Texto variante="pequeno" color={colores.primario}>
            Próxima función: {proxima}
          </Texto>
        ) : null}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    gap: 10,
    padding: 8,
    marginBottom: 8,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
});
