import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colores, radio } from '../../lib/tema';
import { Icono } from './Icono';
import { Texto } from './Texto';

export interface OpcionSelector<T extends string> {
  valor: T;
  etiqueta: string;
  /** Texto extra a la derecha (ej. "6 libres") */
  detalle?: string;
  deshabilitada?: boolean;
}

interface Props<T extends string> {
  etiqueta: string;
  placeholder: string;
  opciones: OpcionSelector<T>[];
  valor: T | null;
  onCambiar: (valor: T) => void;
  deshabilitado?: boolean;
}

/** Select sencillo: un campo que abre una lista para elegir una opción (funciona igual en Android, iOS y web). */
export function Selector<T extends string>({ etiqueta, placeholder, opciones, valor, onCambiar, deshabilitado }: Props<T>) {
  const [abierto, setAbierto] = useState(false);
  const insets = useSafeAreaInsets();
  const elegida = opciones.find((o) => o.valor === valor);

  return (
    <View style={{ gap: 6, flex: 1 }}>
      <Texto variante="pequeno" color={colores.secundario}>
        {etiqueta}
      </Texto>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${etiqueta}: ${elegida?.etiqueta ?? placeholder}`}
        accessibilityState={{ disabled: !!deshabilitado, expanded: abierto }}
        disabled={deshabilitado}
        onPress={() => setAbierto(true)}
        style={({ pressed }) => [estilos.campo, deshabilitado && { opacity: 0.4 }, pressed && { opacity: 0.7 }]}
      >
        <Texto color={elegida ? colores.texto : colores.tenue} numberOfLines={1} style={{ flex: 1 }}>
          {elegida?.etiqueta ?? placeholder}
        </Texto>
        <Icono name="chevron-down" size={18} color={colores.secundario} />
      </Pressable>

      <Modal visible={abierto} transparent animationType="fade" onRequestClose={() => setAbierto(false)}>
        <Pressable style={estilos.fondo} onPress={() => setAbierto(false)} accessibilityLabel="Cerrar">
          <Pressable style={[estilos.hoja, { marginBottom: insets.bottom + 16 }]} onPress={() => {}}>
            <Texto variante="subtitulo" style={estilos.tituloHoja}>
              {etiqueta}
            </Texto>
            <FlatList
              data={opciones}
              keyExtractor={(o) => o.valor}
              ListEmptyComponent={
                <Texto variante="pequeno" color={colores.tenue} style={{ padding: 16 }}>
                  No hay opciones disponibles.
                </Texto>
              }
              renderItem={({ item }) => {
                const activa = item.valor === valor;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: activa, disabled: !!item.deshabilitada }}
                    disabled={item.deshabilitada}
                    onPress={() => {
                      onCambiar(item.valor);
                      setAbierto(false);
                    }}
                    style={({ pressed }) => [
                      estilos.opcion,
                      activa && { backgroundColor: colores.primarioSuave },
                      item.deshabilitada && { opacity: 0.35 },
                      pressed && { backgroundColor: colores.elevadoAlto },
                    ]}
                  >
                    <Texto variante={activa ? 'cuerpoFuerte' : 'cuerpo'} style={{ flex: 1 }}>
                      {item.etiqueta}
                    </Texto>
                    {item.detalle ? (
                      <Texto variante="pequeno" color={colores.tenue}>
                        {item.detalle}
                      </Texto>
                    ) : null}
                    {activa ? <Icono name="checkmark" size={18} color={colores.primario} /> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: radio.m,
    backgroundColor: colores.elevado,
    borderWidth: 1,
    borderColor: colores.bordeFuerte,
  },
  fondo: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 16, backgroundColor: 'rgba(0,0,0,0.6)' },
  hoja: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '70%',
    paddingVertical: 8,
    borderRadius: radio.l,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  tituloHoja: { paddingHorizontal: 16, paddingVertical: 10 },
  opcion: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingHorizontal: 16 },
});
