// Cliente de la API de NestJS (http://IP:3000)

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export interface Director {
  IDDirector: number;
  Director: string;
}

export interface Categoria {
  Identificador: number;
  Categoria: string;
}

export interface Pelicula {
  Identificador: number;
  Titulo: string;
  IDDirector: number;
  Duracion: number;
  IDCategoria: number;
  Sinopsis: string | null;
  /** Ruta relativa que sirve la API, ej. "/posters/1.jpg" (null si no hay imagen) */
  Poster: string | null;
  /** Ruta relativa que sirve la API, ej. "/fondos/1.jpg" (null si no hay imagen) */
  Fondo: string | null;
  director: Director;
  categoria: Categoria;
}

export class ErrorApi extends Error {
  constructor(message: string, public estado?: number) {
    super(message);
  }
}

async function solicitar<T>(ruta: string, tiempoLimite = 10000): Promise<T> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), tiempoLimite);
  try {
    const res = await fetch(`${API_URL}${ruta}`, {
      signal: control.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new ErrorApi(
        res.status === 404 ? 'No encontramos lo que buscas.' : `El servidor respondió con un error (${res.status}).`,
        res.status,
      );
    }
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ErrorApi) throw e;
    throw new ErrorApi('No pudimos conectar con el servidor.');
  } finally {
    clearTimeout(temporizador);
  }
}

export const api = {
  peliculas: () => solicitar<Pelicula[]>('/peliculas'),
  pelicula: (id: number) => solicitar<Pelicula>(`/peliculas/${id}`),
  categorias: () => solicitar<Categoria[]>('/categorias'),
  directores: () => solicitar<Director[]>('/directores'),
};

/** Convierte la ruta relativa de una imagen en URL completa. */
export const urlImagen = (ruta: string | null | undefined) => (ruta ? `${API_URL}${ruta}` : null);
