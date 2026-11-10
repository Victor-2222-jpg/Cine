import { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Pelicula, urlImagen } from '../lib/api';
import { colores, radio } from '../lib/tema';
import { Texto } from './ui/Texto';

type PeliculaImagen = Pick<Pelicula, 'Identificador' | 'Titulo' | 'Poster'>;

interface Props {
  pelicula: PeliculaImagen;
  style?: StyleProp<ViewStyle>;
  redondeo?: number;
}

/** Póster 2:3. Si la película no tiene imagen (o falla la carga) muestra un póster generado. */
export function PosterImagen({ pelicula, style, redondeo = radio.m }: Props) {
  const uri = urlImagen(pelicula.Poster);
  const [fallo, setFallo] = useState(false);
  useEffect(() => setFallo(false), [uri]);

  return (
    <View style={[estilos.base, { borderRadius: redondeo }, style]}>
      {uri && !fallo ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          
          cachePolicy="memory-disk"
          onError={() => setFallo(true)}
          accessibilityLabel={`Póster de ${pelicula.Titulo}`}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, estilos.alterno]}>
          <Texto variante="pequeno" color={colores.secundario} style={{ textAlign: 'center' }}>
            Sin imagen
          </Texto>
        </View>
      )}
      <View style={[StyleSheet.absoluteFill, estilos.borde, { borderRadius: redondeo }]} />
    </View>
  );
}

const estilos = StyleSheet.create({
  base: { aspectRatio: 2 / 3, overflow: 'hidden', backgroundColor: colores.elevadoAlto },
  alterno: { alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10 },
  borde: { borderWidth: 1, borderColor: colores.borde, pointerEvents: 'none' },
});
