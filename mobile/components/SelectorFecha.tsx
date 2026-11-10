import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { diaDelMes, etiquetaDia, mesCorto } from '../lib/formato';
import { colores, radio } from '../lib/tema';
import { Texto } from './ui/Texto';

interface Props {
  fechas: string[];
  seleccionada: string;
  hoy: string;
  onCambiar: (fecha: string) => void;
}

export function SelectorFecha({ fechas, seleccionada, hoy, onCambiar }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.contenido}>
      {fechas.map((f) => {
        const activa = f === seleccionada;
                return (
          <Pressable
            key={f}
            accessibilityRole="button"
            accessibilityState={{ selected: activa }}
            accessibilityLabel={`${etiquetaDia(f, hoy)} ${diaDelMes(f)} de ${mesCorto(f)}`}
            onPress={() => onCambiar(f)}
            style={({ pressed }) => [estilos.dia, activa && estilos.activo, pressed && { opacity: 0.8 }]}
          >
            <Texto variante="pequeno" color={activa ? '#FFFFFF' : colores.texto}>
              {etiquetaDia(f, hoy)} {diaDelMes(f)}/{mesCorto(f)}
            </Texto>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { gap: 6 },
  dia: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radio.s,
    backgroundColor: colores.elevado,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  activo: { backgroundColor: colores.primario, borderColor: colores.primario },
});
