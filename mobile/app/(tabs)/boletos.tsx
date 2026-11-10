import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TarjetaBoleto } from '../../components/TarjetaBoleto';
import { Contenedor } from '../../components/ui/Contenedor';
import { EstadoVista } from '../../components/ui/EstadoVista';
import { Texto } from '../../components/ui/Texto';
import { boletoVigente, useBoletos } from '../../lib/boletos';
import { claveFecha } from '../../lib/formato';
import { colores, radio } from '../../lib/tema';
import { useAhora } from '../../lib/useAhora';

type Pestana = 'proximos' | 'historial';

export default function MisBoletos() {
  const insets = useSafeAreaInsets();
  const { boletos, listo } = useBoletos();
  const ahora = useAhora(60000);
  const hoy = claveFecha(ahora);
  const [pestana, setPestana] = useState<Pestana>('proximos');

  const { proximos, historial } = useMemo(() => {
    const orden = (a: (typeof boletos)[number], b: (typeof boletos)[number]) =>
      a.fecha === b.fecha ? a.inicio - b.inicio : a.fecha.localeCompare(b.fecha);
    return {
      proximos: boletos.filter((b) => boletoVigente(b, ahora)).sort(orden),
      historial: boletos.filter((b) => !boletoVigente(b, ahora)).sort((a, b) => orden(b, a)),
    };
  }, [boletos, ahora]);

  const lista = pestana === 'proximos' ? proximos : historial;

  return (
    <ScrollView
      style={estilos.pantalla}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 40, flexGrow: 1 }}
    >
      <Contenedor ancho={760} style={{ paddingHorizontal: 16, gap: 18, flex: 1 }}>
        <Texto variante="display">Mis boletos</Texto>

        <View style={estilos.segmento}>
          {(
            [
              ['proximos', `Próximos (${proximos.length})`],
              ['historial', `Historial (${historial.length})`],
            ] as const
          ).map(([clave, texto]) => {
            const activo = pestana === clave;
            return (
              <Pressable
                key={clave}
                accessibilityRole="tab"
                accessibilityState={{ selected: activo }}
                onPress={() => setPestana(clave)}
                style={[estilos.opcion, activo && estilos.opcionActiva]}
              >
                <Texto variante="pequenoFuerte" color={activo ? colores.texto : colores.tenue}>
                  {texto}
                </Texto>
              </Pressable>
            );
          })}
        </View>

        {!listo ? (
          <ActivityIndicator color={colores.primario} style={{ marginTop: 40 }} />
        ) : lista.length ? (
          <View style={{ gap: 12 }}>
            {lista.map((b) => (
              <TarjetaBoleto key={b.id} boleto={b} hoy={hoy} finalizado={pestana === 'historial'} />
            ))}
          </View>
        ) : (
          <EstadoVista
            compacto
            icono="ticket-outline"
            titulo={pestana === 'proximos' ? 'No tienes boletos próximos' : 'Tu historial está vacío'}
            mensaje={
              pestana === 'proximos'
                ? 'Elige una película de la cartelera y aparta tus asientos.'
                : 'Aquí aparecerán las funciones a las que ya asististe.'
            }
            accion={pestana === 'proximos' ? { titulo: 'Ver cartelera', icono: 'film-outline', onPress: () => router.navigate('/') } : undefined}
          />
        )}
      </Contenedor>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  segmento: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radio.m,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  opcion: { flex: 1, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: radio.s },
  opcionActiva: { backgroundColor: colores.elevadoAlto },
});
