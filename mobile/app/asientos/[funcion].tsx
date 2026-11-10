import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarraInferior } from '../../components/BarraInferior';
import { Encabezado } from '../../components/Encabezado';
import { Boton } from '../../components/ui/Boton';
import { Contenedor } from '../../components/ui/Contenedor';
import { EstadoVista } from '../../components/ui/EstadoVista';
import { Icono } from '../../components/ui/Icono';
import { OpcionSelector, Selector } from '../../components/ui/Selector';
import { Texto } from '../../components/ui/Texto';
import { useBoletos } from '../../lib/boletos';
import { useCine } from '../../lib/cine';
import { claveFecha, dinero, fechaYHora, ordenarAsientos } from '../../lib/formato';
import { vibrar } from '../../lib/plataforma';
import { asientosOcupados, buscarFuncion, capacidad, idAsiento, letraFila, MAX_BOLETOS, ventaAbierta } from '../../lib/simulacion';
import { colores, radio } from '../../lib/tema';
import { useAhora } from '../../lib/useAhora';

const ANCHO = 640;

export default function SeleccionAsientos() {
  const { funcion: funcionId = '' } = useLocalSearchParams<{ funcion: string }>();
  const insets = useSafeAreaInsets();
  const { peliculas, cargando } = useCine();
  const { asientosReservados } = useBoletos();
  const ahora = useAhora(30000);
  const hoy = claveFecha(ahora);

  const funcion = useMemo(() => buscarFuncion(peliculas, funcionId), [peliculas, funcionId]);
  const ocupados = useMemo(() => (funcion ? asientosOcupados(funcion) : new Set<string>()), [funcion]);
  const tuyos = useMemo(
    () => new Set(funcion ? asientosReservados(funcion.id, funcion.pelicula.Identificador) : []),
    [asientosReservados, funcion],
  );
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [fila, setFila] = useState<string | null>(null);
  const [asiento, setAsiento] = useState<string | null>(null);

  // Si un asiento elegido deja de estar libre (por ejemplo, al volver atrás después de comprarlo), ya no cuenta
  const seleccion = useMemo(() => elegidos.filter((a) => !tuyos.has(a) && !ocupados.has(a)), [elegidos, tuyos, ocupados]);

  // Asientos que todavía se pueden elegir, agrupados por fila
  const libresPorFila = useMemo(() => {
    const mapa = new Map<string, string[]>();
    if (!funcion) return mapa;
    const { filas, columnas } = funcion.sala;
    for (let f = 0; f < filas; f++) {
      const libres: string[] = [];
      for (let c = 0; c < columnas; c++) {
        const id = idAsiento(f, c);
        if (!ocupados.has(id) && !tuyos.has(id) && !seleccion.includes(id)) libres.push(id);
      }
      mapa.set(letraFila(f), libres);
    }
    return mapa;
  }, [funcion, ocupados, tuyos, seleccion]);

  if (!funcion) {
    return (
      <View style={estilos.pantalla}>
        <Encabezado titulo="Elige tus asientos" />
        {cargando ? (
          <View style={[estilos.pantalla, estilos.centro]}>
            <ActivityIndicator color={colores.primario} size="large" />
          </View>
        ) : (
          <EstadoVista
            icono="calendar-clear-outline"
            titulo="Función no disponible"
            mensaje="Esta función ya no existe o el enlace es incorrecto."
            accion={{ titulo: 'Ver cartelera', onPress: () => router.replace('/') }}
          />
        )}
      </View>
    );
  }

  const { sala } = funcion;
  const abierta = ventaAbierta(funcion, ahora);
  const libres = capacidad(sala) - ocupados.size - tuyos.size;
  const total = seleccion.length * sala.precio;
  const lleno = seleccion.length >= MAX_BOLETOS;

  const opcionesFila: OpcionSelector<string>[] = [...libresPorFila].map(([letra, ids]) => ({
    valor: letra,
    etiqueta: `Fila ${letra}`,
    detalle: ids.length ? `${ids.length} ${ids.length === 1 ? 'libre' : 'libres'}` : 'Llena',
    deshabilitada: ids.length === 0,
  }));
  const opcionesAsiento: OpcionSelector<string>[] = (fila ? (libresPorFila.get(fila) ?? []) : []).map((id) => ({
    valor: id,
    etiqueta: `Asiento ${id.slice(1)}`,
  }));

  const elegirFila = (letra: string) => {
    setFila(letra);
    setAsiento(null);
  };

  const agregar = () => {
    if (!asiento || lleno) return;
    setElegidos(ordenarAsientos([...seleccion, asiento]));
    setAsiento(null);
    vibrar();
  };

  const quitar = (id: string) => setElegidos(seleccion.filter((a) => a !== id));

  const continuar = () =>
    router.push({ pathname: '/confirmar', params: { funcion: funcion.id, asientos: seleccion.join(',') } });

  return (
    <View style={estilos.pantalla}>
      <Encabezado
        titulo={funcion.pelicula.Titulo}
        subtitulo={`${sala.nombre} · ${sala.tipo} · ${fechaYHora(funcion.fecha, funcion.inicio, hoy)}`}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 130 }}
      >
        <Contenedor ancho={ANCHO} style={{ paddingHorizontal: 16, gap: 16 }}>
          {!abierta ? (
            <View style={estilos.aviso}>
              <Icono name="lock-closed-outline" size={16} color={colores.advertencia} />
              <Texto variante="pequeno" color={colores.secundario} style={{ flex: 1 }}>
                La venta para esta función ya cerró. Elige otro horario.
              </Texto>
            </View>
          ) : null}

          <View style={estilos.tarjeta}>
            <Texto variante="subtitulo">Elige tus asientos</Texto>
            <View style={estilos.filaSelects}>
              <Selector
                etiqueta="Fila"
                placeholder="Elige fila"
                opciones={opcionesFila}
                valor={fila}
                onCambiar={elegirFila}
                deshabilitado={!abierta || lleno}
              />
              <Selector
                etiqueta="Asiento"
                placeholder="Elige asiento"
                opciones={opcionesAsiento}
                valor={asiento}
                onCambiar={setAsiento}
                deshabilitado={!abierta || lleno || !fila}
              />
            </View>
            <Boton titulo="Agregar asiento" icono="add" variante="secundario" deshabilitado={!asiento || lleno || !abierta} onPress={agregar} />
            <Texto variante="pequeno" color={colores.tenue}>
              {lleno
                ? `Llegaste al máximo de ${MAX_BOLETOS} boletos por compra.`
                : `${libres} de ${capacidad(sala)} disponibles · ${dinero(sala.precio)} por boleto · máximo ${MAX_BOLETOS}`}
            </Texto>
          </View>

          <View style={estilos.tarjeta}>
            <Texto variante="subtitulo">Asientos elegidos</Texto>
            {seleccion.length === 0 ? (
              <Texto variante="pequeno" color={colores.tenue}>
                Todavía no agregas asientos.
              </Texto>
            ) : (
              seleccion.map((id) => (
                <View key={id} style={estilos.elegido}>
                  <Texto variante="cuerpoFuerte" style={{ flex: 1 }}>
                    Fila {id[0]} · Asiento {id.slice(1)}
                  </Texto>
                  <Texto variante="pequeno" color={colores.secundario}>
                    {dinero(sala.precio)}
                  </Texto>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Quitar asiento ${id}`}
                    hitSlop={8}
                    onPress={() => quitar(id)}
                    style={({ pressed }) => [estilos.quitar, pressed && { opacity: 0.6 }]}
                  >
                    <Icono name="close" size={18} color={colores.secundario} />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </Contenedor>
      </ScrollView>

      <BarraInferior ancho={ANCHO}>
        <View style={{ flex: 1 }}>
          <Texto variante="pequeno" color={colores.tenue} numberOfLines={1}>
            {seleccion.length
              ? `${seleccion.length} ${seleccion.length === 1 ? 'boleto' : 'boletos'} · ${seleccion.join(', ')}`
              : 'Sin asientos'}
          </Texto>
          <Texto variante="titulo">{dinero(total)}</Texto>
        </View>
        <Boton titulo="Continuar" tamano="l" deshabilitado={!seleccion.length || !abierta} onPress={continuar} style={{ minWidth: 132 }} />
      </BarraInferior>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  centro: { alignItems: 'center', justifyContent: 'center' },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: radio.m,
    backgroundColor: colores.advertenciaSuave,
  },
  tarjeta: {
    gap: 12,
    padding: 16,
    borderRadius: radio.l,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  filaSelects: { flexDirection: 'row', gap: 12 },
  elegido: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
  },
  quitar: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
