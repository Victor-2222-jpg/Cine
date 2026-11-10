// Boletos comprados por el usuario. Se guardan en el teléfono (AsyncStorage)
// para que sigan ahí aunque cierres la app.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { minutosDesde } from './formato';
import { TipoSala } from './simulacion';

export interface Boleto {
  id: string;
  codigo: string;
  funcionId: string;
  fecha: string;
  inicio: number;
  fin: number;
  salaId: number;
  salaNombre: string;
  salaTipo: TipoSala;
  peliculaId: number;
  titulo: string;
  poster: string | null;
  fondo: string | null;
  asientos: string[];
  precioUnitario: number;
  cargoServicio: number;
  total: number;
  compradoEn: string;
}

export type DatosCompra = Omit<Boleto, 'id' | 'codigo' | 'compradoEn'>;

/** La función del boleto ya empezó (o terminó). Funciona también con funciones que terminan después de medianoche. */
export const boletoIniciado = (b: Boleto, ahora: Date) => minutosDesde(b.fecha, ahora) >= b.inicio;
/** La función del boleto todavía no termina. */
export const boletoVigente = (b: Boleto, ahora: Date) => minutosDesde(b.fecha, ahora) < b.fin;

interface ValorBoletos {
  boletos: Boleto[];
  listo: boolean;
  comprar: (datos: DatosCompra) => Boleto;
  cancelar: (id: string) => void;
  /** Asientos que el usuario ya compró para esa función y esa película */
  asientosReservados: (funcionId: string, peliculaId: number) => string[];
}

const CLAVE = 'cineapp:boletos:v1';
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generarCodigo() {
  let c = '';
  for (let i = 0; i < 6; i++) c += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  return `CA-${c}`;
}

function leer(json: string | null): Boleto[] {
  try {
    const datos = json ? JSON.parse(json) : [];
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

const BoletosContext = createContext<ValorBoletos | null>(null);

export function BoletosProvider({ children }: { children: ReactNode }) {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((json) => {
        const guardados = leer(json);
        setBoletos((actuales) => [...guardados, ...actuales.filter((b) => !guardados.some((g) => g.id === b.id))]);
      })
      .catch(() => {})
      .finally(() => setListo(true));
  }, []);

  useEffect(() => {
    if (listo) AsyncStorage.setItem(CLAVE, JSON.stringify(boletos)).catch(() => {});
  }, [boletos, listo]);

  // En web, si la app está abierta en varias pestañas, todas ven las compras de las demás
  // (así una pestaña no sobrescribe los boletos de otra ni vende dos veces el mismo asiento).
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const alCambiar = (e: StorageEvent) => {
      if (e.key === CLAVE || e.key === null) setBoletos(leer(e.newValue));
    };
    window.addEventListener('storage', alCambiar);
    return () => window.removeEventListener('storage', alCambiar);
  }, []);

  const comprar = useCallback((datos: DatosCompra) => {
    const boleto: Boleto = {
      ...datos,
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      codigo: generarCodigo(),
      compradoEn: new Date().toISOString(),
    };
    setBoletos((actuales) => [boleto, ...actuales]);
    return boleto;
  }, []);

  const cancelar = useCallback((id: string) => {
    setBoletos((actuales) => actuales.filter((b) => b.id !== id));
  }, []);

  // Se agrupa por función Y película: si cambia el catálogo, los asientos no "saltan" a otra película.
  const porFuncion = useMemo(() => {
    const mapa = new Map<string, string[]>();
    boletos.forEach((b) => {
      const clave = `${b.funcionId}#${b.peliculaId}`;
      mapa.set(clave, [...(mapa.get(clave) ?? []), ...b.asientos]);
    });
    return mapa;
  }, [boletos]);

  const asientosReservados = useCallback(
    (funcionId: string, peliculaId: number) => porFuncion.get(`${funcionId}#${peliculaId}`) ?? [],
    [porFuncion],
  );

  const valor = useMemo(
    () => ({ boletos, listo, comprar, cancelar, asientosReservados }),
    [boletos, listo, comprar, cancelar, asientosReservados],
  );

  return <BoletosContext.Provider value={valor}>{children}</BoletosContext.Provider>;
}

export function useBoletos() {
  const ctx = useContext(BoletosContext);
  if (!ctx) throw new Error('useBoletos debe usarse dentro de <BoletosProvider>');
  return ctx;
}
