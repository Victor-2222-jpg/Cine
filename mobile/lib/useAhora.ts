import { useEffect, useState } from 'react';

/** Hora actual que se actualiza sola cada `intervalo` ms (para la simulación en vivo). */
export function useAhora(intervalo = 30000) {
  const [ahora, setAhora] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setAhora(new Date()), intervalo);
    return () => clearInterval(t);
  }, [intervalo]);
  return ahora;
}
