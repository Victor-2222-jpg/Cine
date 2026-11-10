import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Encabezado } from '../../components/Encabezado';
import { Boton } from '../../components/ui/Boton';
import { EstadoVista } from '../../components/ui/EstadoVista';
import { Texto } from '../../components/ui/Texto';
import { Boleto, boletoIniciado, useBoletos } from '../../lib/boletos';
import { dinero, fechaLarga, hora } from '../../lib/formato';
import { avisar, confirmar } from '../../lib/plataforma';
import { colores } from '../../lib/tema';
import { useAhora } from '../../lib/useAhora';

function irA(ruta: '/' | '/boletos') {
  // Cierra el flujo de compra y vuelve a las pestañas
  if (router.canDismiss()) router.dismissAll();
  router.navigate(ruta);
}

export default function VerBoleto() {
  const { id, nuevo } = useLocalSearchParams<{ id: string; nuevo?: string }>();
  const insets = useSafeAreaInsets();
  const { boletos, listo, cancelar } = useBoletos();
  const ahora = useAhora(30000);
  const esNuevo = nuevo === '1';

  // Al cancelar, el boleto desaparece antes de que termine la animación de salida:
  // se sigue mostrando el último para no ver un parpadeo de "Boleto no encontrado".
  const [cancelado, setCancelado] = useState(false);
  const ultimo = useRef<Boleto | undefined>(undefined);
  const encontrado = boletos.find((b) => b.id === id);
  if (encontrado) ultimo.current = encontrado;
  const boleto = encontrado ?? (cancelado ? ultimo.current : undefined);

  if (!boleto) {
    return (
      <View style={estilos.pantalla}>
        <Encabezado titulo="Tu boleto" />
        {!listo ? (
          <View style={[estilos.pantalla, estilos.centro]}>
            <ActivityIndicator color={colores.primario} size="large" />
          </View>
        ) : (
          <EstadoVista
            icono="ticket-outline"
            titulo="Boleto no encontrado"
            mensaje="Puede que lo hayas cancelado."
            accion={{ titulo: 'Ver mis boletos', onPress: () => irA('/boletos') }}
          />
        )}
      </View>
    );
  }

  const yaEmpezo = boletoIniciado(boleto, ahora);

  const cancelarBoleto = async () => {
    const uno = boleto.asientos.length === 1;
    const ok = await confirmar(
      '¿Cancelar este boleto?',
      `${uno ? 'Se liberará el asiento' : 'Se liberarán los asientos'} ${boleto.asientos.join(', ')} y se te reembolsarán ${dinero(boleto.total)} (simulado).`,
      'Sí, cancelar',
      true,
      'Conservar',
    );
    if (!ok) return;
    // Se revisa la hora otra vez: el diálogo pudo quedarse abierto hasta después de que empezó la función
    if (boletoIniciado(boleto, new Date())) {
      avisar('Ya no se puede cancelar', 'La función ya comenzó.');
      return;
    }
    setCancelado(true);
    cancelar(boleto.id);
    irA('/boletos');
  };

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Tu boleto" />
      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 30, gap: 12 }}>
        {esNuevo ? (
          <View style={[estilos.caja, { backgroundColor: colores.exitoSuave, borderColor: colores.exito }]}>
            <Texto variante="subtitulo" color={colores.exito}>
              ¡Compra exitosa!
            </Texto>
            <Texto variante="pequeno">Presenta este código en la entrada de la sala.</Texto>
          </View>
        ) : null}

        <View style={estilos.caja}>
          <Texto variante="titulo">{boleto.titulo}</Texto>
          <Texto>Fecha: {fechaLarga(boleto.fecha)}</Texto>
          <Texto>
            Hora: {hora(boleto.inicio)} - {hora(boleto.fin)}
          </Texto>
          <Texto>
            Sala: {boleto.salaNombre} ({boleto.salaTipo})
          </Texto>
          <Texto>Asientos: {boleto.asientos.join(', ')}</Texto>
          <Texto>Total pagado: {dinero(boleto.total)}</Texto>
        </View>

        <View style={[estilos.caja, { alignItems: 'center' }]}>
          <Texto variante="pequeno" color={colores.secundario}>
            Folio de acceso a la sala
          </Texto>
          <Texto variante="display">{boleto.codigo}</Texto>
        </View>

        {esNuevo ? (
          <>
            <Boton titulo="Ver mis boletos" onPress={() => irA('/boletos')} />
            <Boton titulo="Volver a la cartelera" variante="secundario" onPress={() => irA('/')} />
          </>
        ) : cancelado ? null : !yaEmpezo ? (
          <Boton titulo="Cancelar boleto" variante="secundario" onPress={cancelarBoleto} />
        ) : (
          <Texto variante="pequeno" color={colores.tenue}>
            Esta función ya comenzó o terminó.
          </Texto>
        )}
      </ScrollView>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  centro: { alignItems: 'center', justifyContent: 'center' },
  caja: { gap: 6, padding: 12, backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde },
});
