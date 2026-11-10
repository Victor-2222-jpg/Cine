// Utilidades de formato (fechas, horas, dinero) sin depender de Intl,
// para que funcionen igual en Android, iOS y web.

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const pad = (n: number) => String(n).padStart(2, '0');

/** 169 -> "2 h 49 min" */
export function duracion(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Minutos desde la medianoche -> "19:30" (las funciones que pasan de medianoche se muestran como 00:15) */
export function hora(minutos: number) {
  const m = ((Math.round(minutos) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

export const minutosDelDia = (d: Date) => d.getHours() * 60 + d.getMinutes();

/** Fecha local -> "2026-11-08" (no usamos toISOString porque convierte a UTC). */
export function claveFecha(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fechaDeClave(clave: string) {
  const [y, m, d] = clave.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function sumarDias(clave: string, dias: number) {
  const d = fechaDeClave(clave);
  d.setDate(d.getDate() + dias);
  return claveFecha(d);
}

export function diferenciaDias(a: string, b: string) {
  return Math.round((fechaDeClave(a).getTime() - fechaDeClave(b).getTime()) / 86400000);
}

/**
 * Minutos transcurridos desde la medianoche de `fecha` hasta `ahora`.
 * Puede ser mayor a 1440 (funciones que terminan después de medianoche) o negativo (días futuros).
 */
export function minutosDesde(fecha: string, ahora: Date) {
  return diferenciaDias(claveFecha(ahora), fecha) * 1440 + minutosDelDia(ahora) + ahora.getSeconds() / 60;
}

/** "Hoy", "Mañana" o el día corto ("Mié") */
export function etiquetaDia(clave: string, hoy: string) {
  const dif = diferenciaDias(clave, hoy);
  if (dif === 0) return 'Hoy';
  if (dif === 1) return 'Mañana';
  if (dif === -1) return 'Ayer';
  return DIAS_CORTOS[fechaDeClave(clave).getDay()];
}

export const diaDelMes = (clave: string) => fechaDeClave(clave).getDate();
export const mesCorto = (clave: string) => MESES_CORTOS[fechaDeClave(clave).getMonth()];

/** "Dom 8 nov" */
export function fechaCorta(clave: string) {
  const d = fechaDeClave(clave);
  return `${DIAS_CORTOS[d.getDay()]} ${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`;
}

/** "Domingo 8 de noviembre" */
export function fechaLarga(clave: string) {
  const d = fechaDeClave(clave);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

/** "Hoy, 19:30" / "Mañana, 16:10" / "Mié 11 nov, 21:00" */
export function fechaYHora(clave: string, minutos: number, hoy: string) {
  const dif = diferenciaDias(clave, hoy);
  const dia = dif === 0 || dif === 1 ? etiquetaDia(clave, hoy) : fechaCorta(clave);
  return `${dia}, ${hora(minutos)}`;
}

/** 1234.5 -> "$1,234.50" */
export function dinero(n: number) {
  const [entero, decimales] = n.toFixed(2).split('.');
  return `$${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimales}`;
}

/** Quita acentos y pasa a minúsculas para búsquedas. */
export function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .trim();
}


/** Ordena asientos tipo "C10", "A2" -> A2, C10 */
export function ordenarAsientos(asientos: string[]) {
  return [...asientos].sort((a, b) =>
    a[0] === b[0] ? Number(a.slice(1)) - Number(b.slice(1)) : a.localeCompare(b),
  );
}
