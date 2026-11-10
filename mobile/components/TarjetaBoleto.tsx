import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Boleto } from '../lib/boletos';
import { fechaYHora } from '../lib/formato';
import { colores } from '../lib/tema';
import { Texto } from './ui/Texto';

export function TarjetaBoleto({ boleto, hoy, finalizado }: { boleto: Boleto; hoy: string; finalizado?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/boleto/${boleto.id}`)}
      style={({ pressed }) => [estilos.tarjeta, finalizado && { opacity: 0.6 }, pressed && { opacity: 0.7 }]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Texto variante="cuerpoFuerte">{boleto.titulo}</Texto>
        <Texto variante="pequeno">Fecha: {fechaYHora(boleto.fecha, boleto.inicio, hoy)}</Texto>
        <Texto variante="pequeno">Sala: {boleto.salaNombre} ({boleto.salaTipo})</Texto>
        <Texto variante="pequeno">Asientos: {boleto.asientos.join(', ')}</Texto>
      </View>
      <Texto variante="pequeno" color={colores.primario}>
        Ver &gt;
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
});
