import { existsSync, statSync } from 'fs';
import { join } from 'path';

// Carpeta api/public: aquí viven los pósters y fondos de las películas.
// Las imágenes se nombran con el Identificador de la película: posters/1.jpg, fondos/1.jpg
export const CARPETA_PUBLICA = join(__dirname, '..', 'public');

export type TipoImagen = 'posters' | 'fondos';

/**
 * Devuelve la ruta pública de la imagen (ej. "/posters/1.jpg?v=1731100000000") o null si no existe.
 * El parámetro "v" cambia cuando reemplazas el archivo, así la app no muestra la imagen vieja guardada en caché.
 */
export function rutaImagen(tipo: TipoImagen, id: number): string | null {
  const archivo = `${id}.jpg`;
  const ruta = join(CARPETA_PUBLICA, tipo, archivo);
  if (!existsSync(ruta)) return null;
  return `/${tipo}/${archivo}?v=${Math.floor(statSync(ruta).mtimeMs)}`;
}
