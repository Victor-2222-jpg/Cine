import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarraInferior } from '../components/BarraInferior';
import { Encabezado } from '../components/Encabezado';
import { Boton } from '../components/ui/Boton';
import { Contenedor } from '../components/ui/Contenedor';
import { EstadoVista } from '../components/ui/EstadoVista';
import { Texto } from '../components/ui/Texto';
import { useBoletos } from '../lib/boletos';
import { useCine } from '../lib/cine';
import { dinero, fechaLarga, hora, ordenarAsientos } from '../lib/formato';
import { avisar, vibrar } from '../lib/plataforma';
import { asientoValido, asientosOcupados, buscarFuncion, CARGO_SERVICIO, MAX_BOLETOS, ventaAbierta } from '../lib/simulacion';
import { colores, radio } from '../lib/tema';

const ANCHO = 640;

export default function ConfirmarCompra() {
  const { funcion: funcionId = '', asientos = '' } = useLocalSearchParams<{ funcion: string; asientos: string }>();
  const insets = useSafeAreaInsets();
  const { peliculas, cargando } = useCine();
  const { comprar, asientosReservados } = useBoletos();
  const [pagando, setPagando] = useState(false);
  const montado = useRef(true);
  useEffect(
    () => () => {
      montado.current = false;
    },
    [],
  );

  const funcion = useMemo(() => buscarFuncion(peliculas, funcionId), [peliculas, funcionId]);
  const lista = useMemo(
    () => ordenarAsientos([...new Set(asientos.split(',').map((a) => a.trim().toUpperCase()).filter(Boolean))]),
    [asientos],
  );

  if (!funcion) {
    return (
      <View style={estilos.pantalla}>
        <Encabezado titulo="Confirmar compra" />
        {cargando ? (
          <View style={[estilos.pantalla, estilos.centro]}>
            <ActivityIndicator color={colores.primario} size="large" />
          </View>
        ) : (
          <EstadoVista
            icono="alert-circle-outline"
            titulo="No encontramos la función"
            accion={{ titulo: 'Ver cartelera', onPress: () => router.replace('/') }}
          />
        )}
      </View>
    );
  }

  const { sala, pelicula } = funcion;
  const asientosValidos = lista.length > 0 && lista.length <= MAX_BOLETOS && lista.every((a) => asientoValido(sala, a));

  if (!asientosValidos) {
    return (
      <View style={estilos.pantalla}>
        <Encabezado titulo="Confirmar compra" />
        <EstadoVista
          icono="grid-outline"
          titulo="Selección no válida"
          mensaje="Regresa y elige tus asientos de nuevo."
          accion={{ titulo: 'Elegir asientos', onPress: () => router.replace(`/asientos/${funcion.id}`) }}
        />
      </View>
    );
  }

  const n = lista.length;
  const subtotal = n * sala.precio;
  const cargo = n * CARGO_SERVICIO;
  const total = subtotal + cargo;

  const pagar = () => {
    if (!ventaAbierta(funcion, new Date())) {
      avisar('La venta cerró', 'Esta función ya comenzó. Elige otro horario.');
      return;
    }
    const ocupados = asientosOcupados(funcion);
    const reservados = new Set(asientosReservados(funcion.id, pelicula.Identificador));
    const conflicto = lista.filter((a) => ocupados.has(a) || reservados.has(a));
    if (conflicto.length) {
      avisar(
        conflicto.length === 1 ? 'Asiento no disponible' : 'Asientos no disponibles',
        conflicto.length === 1
          ? `El asiento ${conflicto[0]} ya no está disponible.`
          : `Los asientos ${conflicto.join(', ')} ya no están disponibles.`,
      );
      return;
    }
    setPagando(true);
    // Simulamos el tiempo de procesamiento del pago
    setTimeout(() => {
      if (!montado.current) return;
      const boleto = comprar({
        funcionId: funcion.id,
        fecha: funcion.fecha,
        inicio: funcion.inicio,
        fin: funcion.fin,
        salaId: sala.id,
        salaNombre: sala.nombre,
        salaTipo: sala.tipo,
        peliculaId: pelicula.Identificador,
        titulo: pelicula.Titulo,
        poster: pelicula.Poster,
        fondo: pelicula.Fondo,
        asientos: lista,
        precioUnitario: sala.precio,
        cargoServicio: CARGO_SERVICIO,
        total,
      });
      vibrar('exito');
      router.replace({ pathname: '/boleto/[id]', params: { id: boleto.id, nuevo: '1' } });
    }, 1100);
  };

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Confirmar compra" subtitulo="Revisa los detalles antes de pagar" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 120 }}
      >
        <Contenedor ancho={ANCHO} style={{ paddingHorizontal: 16, gap: 16 }}>
          <View style={estilos.tarjeta}>
            <Texto variante="subtitulo" numberOfLines={2}>
              {pelicula.Titulo}
            </Texto>
            <Fila izquierda="Fecha" derecha={fechaLarga(funcion.fecha)} />
            <Fila izquierda="Horario" derecha={`${hora(funcion.inicio)} – ${hora(funcion.fin)}`} />
            <Fila izquierda="Sala" derecha={`${sala.nombre} · ${sala.tipo}`} />
            <Fila izquierda={n === 1 ? 'Asiento' : 'Asientos'} derecha={lista.join(', ')} />
          </View>

          <View style={estilos.tarjeta}>
            <Texto variante="subtitulo">Resumen de pago</Texto>
            <Fila izquierda={`Boletos (${n} × ${dinero(sala.precio)})`} derecha={dinero(subtotal)} />
            <Fila izquierda={`Cargo por servicio (${n} × ${dinero(CARGO_SERVICIO)})`} derecha={dinero(cargo)} />
            <View style={estilos.separador} />
            <Fila izquierda="Total" derecha={dinero(total)} fuerte />
          </View>

          <Texto variante="pequeno" color={colores.tenue} style={{ textAlign: 'center' }}>
            Compra simulada: no se realiza ningún cargo real.
          </Texto>
        </Contenedor>
      </ScrollView>

      <BarraInferior ancho={ANCHO}>
        <Boton
          titulo={pagando ? 'Procesando...' : `Pagar ${dinero(total)}`}
          tamano="l"
          cargando={pagando}
          onPress={pagar}
          style={{ flex: 1 }}
        />
      </BarraInferior>
    </View>
  );
}

function Fila({ izquierda, derecha, fuerte }: { izquierda: string; derecha: string; fuerte?: boolean }) {
  return (
    <View style={estilos.fila}>
      <Texto variante={fuerte ? 'subtitulo' : 'pequeno'} color={fuerte ? colores.texto : colores.secundario}>
        {izquierda}
      </Texto>
      <Texto variante={fuerte ? 'titulo' : 'pequenoFuerte'} style={{ flex: 1, textAlign: 'right' }}>
        {derecha}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  centro: { alignItems: 'center', justifyContent: 'center' },
  tarjeta: {
    gap: 12,
    padding: 16,
    borderRadius: radio.l,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  separador: { height: StyleSheet.hairlineWidth, backgroundColor: colores.bordeFuerte },
});
