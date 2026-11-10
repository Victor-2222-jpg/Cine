import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TarjetaPelicula } from '../../components/TarjetaPelicula';
import { Contenedor } from '../../components/ui/Contenedor';
import { EstadoVista } from '../../components/ui/EstadoVista';
import { Texto } from '../../components/ui/Texto';
import { API_URL } from '../../lib/api';
import { useCine, useFunciones } from '../../lib/cine';
import { claveFecha, fechaLarga, hora, minutosDelDia, normalizar } from '../../lib/formato';
import { salaDePelicula } from '../../lib/simulacion';
import { colores } from '../../lib/tema';
import { useAhora } from '../../lib/useAhora';

export default function Cartelera() {
  const insets = useSafeAreaInsets();
  const { peliculas, cargando, refrescando, error, recargar } = useCine();
  const ahora = useAhora(60000);
  const hoy = claveFecha(ahora);
  const funcionesHoy = useFunciones(hoy);
  const [busqueda, setBusqueda] = useState('');

  const salaDe = useCallback((id: number) => salaDePelicula(peliculas, id), [peliculas]);

  const proximas = useMemo(() => {
    const min = minutosDelDia(ahora);
    const mapa = new Map<number, string>();
    for (const f of funcionesHoy) {
      if (f.inicio > min && !mapa.has(f.pelicula.Identificador)) mapa.set(f.pelicula.Identificador, hora(f.inicio));
    }
    return mapa;
  }, [funcionesHoy, ahora]);

  const termino = normalizar(busqueda);
  const filtradas = useMemo(
    () =>
      peliculas
        .filter(
          (p) =>
            !termino ||
            normalizar(`${p.Titulo} ${p.director?.Director ?? ''} ${p.categoria?.Categoria ?? ''}`).includes(termino),
        )
        .sort((a, b) => a.Titulo.localeCompare(b.Titulo)),
    [peliculas, termino],
  );

  if (cargando && !peliculas.length) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
        <Texto style={{ marginTop: 8 }}>Cargando...</Texto>
      </View>
    );
  }

  if (error && !peliculas.length) {
    return (
      <EstadoVista
        icono="cloud-offline-outline"
        titulo="Sin conexión con el servidor"
        mensaje={`Revisa que la API esté encendida y que tu celular esté en la misma red WiFi que la computadora.\n\n${API_URL}`}
        accion={{ titulo: 'Reintentar', onPress: recargar }}
        style={{ paddingTop: insets.top }}
      />
    );
  }

  if (!peliculas.length) {
    return (
      <EstadoVista
        icono="film-outline"
        titulo="Aún no hay películas en cartelera"
        mensaje="Agrega películas desde la API y vuelve a cargar."
        accion={{ titulo: 'Actualizar', onPress: recargar }}
        style={{ paddingTop: insets.top }}
      />
    );
  }

  return (
    <ScrollView
      style={estilos.pantalla}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 30 }}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={refrescando} onRefresh={recargar} />}
    >
      <Contenedor style={estilos.relleno}>
        <Texto variante="display">CineAPP</Texto>
        <Texto variante="pequeno" color={colores.secundario}>
          Cartelera de hoy: {fechaLarga(hoy)}
        </Texto>

        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar película..."
          placeholderTextColor={colores.tenue}
          autoCorrect={false}
          style={estilos.input}
        />

        {error ? (
          <Texto variante="pequeno" color={colores.peligro} style={{ marginTop: 8 }}>
            No se pudo actualizar la cartelera.
          </Texto>
        ) : null}

        <Texto variante="subtitulo" style={{ marginTop: 16, marginBottom: 8 }}>
          Películas ({filtradas.length})
        </Texto>

        {filtradas.length ? (
          filtradas.map((p) => (
            <TarjetaPelicula
              key={p.Identificador}
              pelicula={p}
              sala={salaDe(p.Identificador)}
              proxima={proximas.get(p.Identificador)}
            />
          ))
        ) : (
          <Texto color={colores.secundario}>No se encontraron películas.</Texto>
        )}
      </Contenedor>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  relleno: { paddingHorizontal: 12 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colores.fondo },
  input: {
    marginTop: 12,
    height: 42,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    color: colores.texto,
    fontSize: 15,
  },
});
