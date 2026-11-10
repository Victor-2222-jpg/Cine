import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Encabezado } from '../../components/Encabezado';
import { PosterImagen } from '../../components/PosterImagen';
import { SelectorFecha } from '../../components/SelectorFecha';
import { Contenedor } from '../../components/ui/Contenedor';
import { EstadoVista } from '../../components/ui/EstadoVista';
import { Texto } from '../../components/ui/Texto';
import { api, Pelicula } from '../../lib/api';
import { useBoletos } from '../../lib/boletos';
import { useCine, useFunciones } from '../../lib/cine';
import { claveFecha, dinero, duracion, hora } from '../../lib/formato';
import { disponibilidad, Funcion, proximasFechas, salaDePelicula, ventaAbierta } from '../../lib/simulacion';
import { colores } from '../../lib/tema';
import { useAhora } from '../../lib/useAhora';

export default function DetallePelicula() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNum = Number(id);
  const insets = useSafeAreaInsets();
  const { peliculas } = useCine();
  const { asientosReservados } = useBoletos();

  // Mostramos al instante lo que ya está en memoria y pedimos el detalle actualizado a la API.
  const enMemoria = peliculas.find((p) => p.Identificador === idNum);
  const [remota, setRemota] = useState<Pelicula | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    setRemota(null);
    setError(null);
    api
      .pelicula(idNum)
      .then((p) => activo && setRemota(p))
      .catch((e) => activo && setError(e instanceof Error ? e.message : 'Ocurrió un error.'));
    return () => {
      activo = false;
    };
  }, [idNum]);

  const pelicula = remota ?? enMemoria ?? null;

  const ahora = useAhora(30000);
  const hoy = claveFecha(ahora);
  const fechas = useMemo(() => proximasFechas(hoy), [hoy]);
  const [fecha, setFecha] = useState(hoy);
  const fechaValida = fechas.includes(fecha) ? fecha : hoy;
  const funcionesDia = useFunciones(fechaValida);
  const funciones = funcionesDia.filter((f) => f.pelicula.Identificador === idNum);

  if (!pelicula) {
    return (
      <View style={estilos.pantalla}>
        <Encabezado titulo="Película" />
        {error ? (
          <EstadoVista
            icono="film-outline"
            titulo="No encontramos esta película"
            mensaje={error}
            accion={{ titulo: 'Volver a la cartelera', onPress: () => router.replace('/') }}
          />
        ) : (
          <View style={[estilos.pantalla, estilos.centro]}>
            <ActivityIndicator color={colores.primario} size="large" />
          </View>
        )}
      </View>
    );
  }

  const sala = salaDePelicula(peliculas, pelicula.Identificador);
  const sinopsis = pelicula.Sinopsis?.trim() || 'Sinopsis no disponible.';

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo={pelicula.Titulo} />
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 30, gap: 12 }}>
        <Contenedor style={{ gap: 12 }}>
          <View style={estilos.caja}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <PosterImagen pelicula={pelicula} style={{ width: 100 }} redondeo={0} />
              <View style={{ flex: 1, gap: 4 }}>
                <Texto variante="titulo">{pelicula.Titulo}</Texto>
                <Texto variante="pequeno">Género: {pelicula.categoria?.Categoria ?? 'Sin categoría'}</Texto>
                <Texto variante="pequeno">Duración: {duracion(pelicula.Duracion)}</Texto>
                <Texto variante="pequeno">Director: {pelicula.director?.Director ?? '-'}</Texto>
                <Texto variante="pequeno">Sala: {sala ? `${sala.nombre} (${sala.tipo})` : '-'}</Texto>
                {sala ? <Texto variante="pequeno">Precio: {dinero(sala.precio)}</Texto> : null}
              </View>
            </View>
          </View>

          <View style={estilos.caja}>
            <Texto variante="subtitulo">Sinopsis</Texto>
            <Texto color={colores.secundario}>{sinopsis}</Texto>
          </View>

          <View style={estilos.caja}>
            <Texto variante="subtitulo">Horarios</Texto>
            <SelectorFecha fechas={fechas} seleccionada={fechaValida} hoy={hoy} onCambiar={setFecha} />
            {funciones.length ? (
              funciones.map((f) => (
                <BotonHorario key={f.id} funcion={f} ahora={ahora} extra={asientosReservados(f.id, f.pelicula.Identificador).length} />
              ))
            ) : (
              <Texto variante="pequeno" color={colores.secundario}>
                No hay funciones para este día.
              </Texto>
            )}
          </View>
        </Contenedor>
      </ScrollView>
    </View>
  );
}

function BotonHorario({ funcion, ahora, extra }: { funcion: Funcion; ahora: Date; extra: number }) {
  const abierta = ventaAbierta(funcion, ahora);
  const agotada = disponibilidad(funcion, extra) === 'agotada';
  const activo = abierta && !agotada;
  const estado = !abierta ? 'No disponible' : agotada ? 'Agotada' : 'Disponible';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!activo}
      onPress={() => router.push(`/asientos/${funcion.id}`)}
      style={({ pressed }) => [estilos.horario, !activo && { opacity: 0.4 }, pressed && { backgroundColor: colores.primarioSuave }]}
    >
      <Texto variante="cuerpoFuerte">{hora(funcion.inicio)}</Texto>
      <Texto variante="pequeno" color={colores.secundario} style={{ flex: 1 }}>
        {funcion.sala.nombre} - {funcion.sala.tipo}
      </Texto>
      <Texto variante="pequeno" color={activo ? colores.exito : colores.tenue}>
        {estado}
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  centro: { alignItems: 'center', justifyContent: 'center' },
  caja: { gap: 8, padding: 10, backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde },
  horario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colores.borde,
  },
});
