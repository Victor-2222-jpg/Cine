// Estado global de la cartelera: películas y categorías que vienen de la API.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, Categoria, Pelicula } from './api';
import { Funcion, generarFunciones } from './simulacion';

interface ValorCine {
  peliculas: Pelicula[];
  categorias: Categoria[];
  /** Carga inicial (o reintento sin datos) */
  cargando: boolean;
  /** Recarga con "jalar para actualizar" */
  refrescando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
}

const CineContext = createContext<ValorCine | null>(null);

export function CineProvider({ children }: { children: ReactNode }) {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hayDatos = useRef(false);

  const recargar = useCallback(async () => {
    if (hayDatos.current) setRefrescando(true);
    else setCargando(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([api.peliculas(), api.categorias()]);
      setPeliculas(p);
      setCategorias(c);
      hayDatos.current = p.length > 0;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const valor = useMemo(
    () => ({ peliculas, categorias, cargando, refrescando, error, recargar }),
    [peliculas, categorias, cargando, refrescando, error, recargar],
  );

  return <CineContext.Provider value={valor}>{children}</CineContext.Provider>;
}

export function useCine() {
  const ctx = useContext(CineContext);
  if (!ctx) throw new Error('useCine debe usarse dentro de <CineProvider>');
  return ctx;
}

/** Cartelera simulada del día indicado. */
export function useFunciones(fecha: string): Funcion[] {
  const { peliculas } = useCine();
  return useMemo(() => generarFunciones(peliculas, fecha), [peliculas, fecha]);
}
