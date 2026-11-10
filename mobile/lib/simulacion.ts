// Simulación del cine: salas, cartelera del día y ocupación de asientos.
// Todo es determinista (misma fecha + misma función = mismo resultado),
// así la sala "se comporta" igual cada vez que la abres.

import { Pelicula } from './api';
import { claveFecha, diferenciaDias, fechaDeClave, minutosDesde, sumarDias } from './formato';

export type TipoSala = 'IMAX' | 'VIP' | '4DX' | '3D' | 'Tradicional';

export interface Sala {
  id: number;
  nombre: string;
  tipo: TipoSala;
  precio: number;
  filas: number;
  columnas: number;
  /** Columnas (1-based) después de las cuales hay un pasillo */
  pasillos: number[];
  descripcion: string;
  color: string;
}

export const SALAS: Sala[] = [
  { id: 1, nombre: 'Sala 1', tipo: 'IMAX', precio: 129, filas: 8, columnas: 10, pasillos: [2, 8], descripcion: 'Pantalla gigante y sonido envolvente', color: '#38BDF8' },
  { id: 2, nombre: 'Sala 2', tipo: 'VIP', precio: 179, filas: 5, columnas: 6, pasillos: [3], descripcion: 'Butacas reclinables y servicio a tu asiento', color: '#F5B942' },
  { id: 3, nombre: 'Sala 3', tipo: '4DX', precio: 149, filas: 6, columnas: 8, pasillos: [4], descripcion: 'Butacas con movimiento, viento y efectos', color: '#A78BFA' },
  { id: 4, nombre: 'Sala 4', tipo: '3D', precio: 99, filas: 7, columnas: 10, pasillos: [5], descripcion: 'Proyección digital en tercera dimensión', color: '#34D399' },
  { id: 5, nombre: 'Sala 5', tipo: 'Tradicional', precio: 79, filas: 8, columnas: 10, pasillos: [2, 8], descripcion: 'Proyección digital y sonido Dolby', color: '#94A3B8' },
];

export const CARGO_SERVICIO = 12;
export const MAX_BOLETOS = 8;
export const DIAS_EN_CARTELERA = 5;

export const capacidad = (sala: Sala) => sala.filas * sala.columnas;

export interface Funcion {
  /** "2026-11-08_1_660" -> fecha_sala_minutoDeInicio */
  id: string;
  fecha: string;
  sala: Sala;
  pelicula: Pelicula;
  /** minutos desde medianoche */
  inicio: number;
  fin: number;
}

const APERTURA = 11 * 60; // primera función 11:00
const ULTIMO_INICIO = 22 * 60 + 45; // última función 22:45
const LIMPIEZA = 20; // minutos entre funciones
const redondear = (m: number, paso = 10) => Math.ceil(m / paso) * paso;

/** Reparte las películas en las salas (por Identificador, en orden). */
export function salaDePelicula(peliculas: Pelicula[], id: number): Sala | undefined {
  const ordenadas = [...peliculas].sort((a, b) => a.Identificador - b.Identificador);
  const idx = ordenadas.findIndex((p) => p.Identificador === id);
  return idx >= 0 ? SALAS[idx % SALAS.length] : undefined;
}

/** Genera la cartelera completa de un día: cada sala alterna sus películas de 11:00 a 22:45. */
export function generarFunciones(peliculas: Pelicula[], fecha: string): Funcion[] {
  const ordenadas = [...peliculas].sort((a, b) => a.Identificador - b.Identificador);
  const numeroDia = Math.floor(fechaDeClave(fecha).getTime() / 86400000);
  const funciones: Funcion[] = [];

  SALAS.forEach((sala, i) => {
    const cartelera = ordenadas.filter((_, idx) => idx % SALAS.length === i);
    if (!cartelera.length) return;
    let inicio = APERTURA + i * 15; // las salas empiezan escalonadas
    let turno = numeroDia % cartelera.length; // cada día abre una película distinta
    while (inicio <= ULTIMO_INICIO) {
      const pelicula = cartelera[turno % cartelera.length];
      const fin = inicio + pelicula.Duracion;
      funciones.push({ id: `${fecha}_${sala.id}_${inicio}`, fecha, sala, pelicula, inicio, fin });
      inicio = redondear(fin + LIMPIEZA);
      turno++;
    }
  });

  return funciones.sort((a, b) => a.inicio - b.inicio || a.sala.id - b.sala.id);
}

export function proximasFechas(hoy: string, dias = DIAS_EN_CARTELERA) {
  return Array.from({ length: dias }, (_, i) => sumarDias(hoy, i));
}

// ---------- Asientos ----------

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const letraFila = (fila: number) => LETRAS[fila];
export const idAsiento = (fila: number, columna: number) => `${LETRAS[fila]}${columna + 1}`;

/** true si el asiento existe en la sala y está escrito en formato canónico ("C7", no "C07" ni "C7.0") */
export function asientoValido(sala: Sala, id: string) {
  const fila = LETRAS.indexOf(id.charAt(0));
  const columna = Number(id.slice(1));
  return (
    fila >= 0 &&
    fila < sala.filas &&
    Number.isInteger(columna) &&
    columna >= 1 &&
    columna <= sala.columnas &&
    id === idAsiento(fila, columna - 1)
  );
}

function hash(texto: string) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function aleatorio(semilla: number) {
  let s = semilla;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Demanda según la hora y el día: las funciones de la noche y del fin de semana se llenan más. */
function demanda(funcion: Funcion) {
  const h = funcion.inicio / 60;
  const dia = fechaDeClave(funcion.fecha).getDay();
  const finDeSemana = dia === 0 || dia === 5 || dia === 6;
  let base = h < 14 ? 0.2 : h < 17 ? 0.36 : h < 21 ? 0.62 : 0.46;
  if (finDeSemana) base += 0.14;
  if (funcion.sala.tipo === 'VIP') base -= 0.08;
  return base;
}

const cacheOcupados = new Map<string, Set<string>>();

/** Asientos ocupados por otros clientes (simulados). */
export function asientosOcupados(funcion: Funcion): Set<string> {
  const clave = `${funcion.id}_${funcion.pelicula.Identificador}`;
  const guardado = cacheOcupados.get(clave);
  if (guardado) return guardado;

  const { sala } = funcion;
  const rnd = aleatorio(hash(clave));
  const ratio = Math.min(0.93, Math.max(0.06, demanda(funcion) + (rnd() - 0.5) * 0.24));
  const objetivo = Math.round(capacidad(sala) * ratio);

  // La gente prefiere el centro de la sala: cada asiento recibe un puntaje aleatorio ponderado.
  const candidatos: { id: string; puntaje: number }[] = [];
  for (let f = 0; f < sala.filas; f++) {
    for (let c = 0; c < sala.columnas; c++) {
      const centroColumna = 1 - Math.abs(c - (sala.columnas - 1) / 2) / (sala.columnas / 2);
      const centroFila = 1 - Math.abs(f - (sala.filas - 1) * 0.6) / sala.filas;
      const peso = 0.3 + centroColumna * 0.45 + centroFila * 0.25;
      candidatos.push({ id: idAsiento(f, c), puntaje: rnd() * peso });
    }
  }
  candidatos.sort((a, b) => b.puntaje - a.puntaje);
  const ocupados = new Set(candidatos.slice(0, objetivo).map((a) => a.id));
  cacheOcupados.set(clave, ocupados);
  return ocupados;
}

export type Disponibilidad = 'disponible' | 'pocos' | 'agotada';

export function disponibilidad(funcion: Funcion, extra = 0): Disponibilidad {
  const libres = capacidad(funcion.sala) - asientosOcupados(funcion).size - extra;
  if (libres <= 0) return 'agotada';
  if (libres / capacidad(funcion.sala) < 0.2) return 'pocos';
  return 'disponible';
}

// ---------- Estado en tiempo real ----------

export type EstadoFuncion = 'finalizada' | 'en-curso' | 'proxima';

/** Minutos de `ahora` contados desde la medianoche del día de la función (sirve aunque ya sea el día siguiente). */
export const minutoDeFuncion = (funcion: Funcion, ahora: Date) => minutosDesde(funcion.fecha, ahora);

export function estadoFuncion(funcion: Funcion, ahora: Date): EstadoFuncion {
  const min = minutoDeFuncion(funcion, ahora);
  if (min < funcion.inicio) return 'proxima';
  if (min < funcion.fin) return 'en-curso';
  return 'finalizada';
}

/** Solo se venden boletos para funciones que todavía no empiezan y que están dentro de los días en cartelera. */
export const ventaAbierta = (funcion: Funcion, ahora: Date) =>
  estadoFuncion(funcion, ahora) === 'proxima' && diferenciaDias(funcion.fecha, claveFecha(ahora)) < DIAS_EN_CARTELERA;

/** Busca una función por su id ("fecha_sala_inicio"). Rechaza fechas que no existen (ej. 2026-02-30). */
export function buscarFuncion(peliculas: Pelicula[], funcionId: string): Funcion | undefined {
  const [fecha] = funcionId.split('_');
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha) || claveFecha(fechaDeClave(fecha)) !== fecha) return undefined;
  return generarFunciones(peliculas, fecha).find((f) => f.id === funcionId);
}
