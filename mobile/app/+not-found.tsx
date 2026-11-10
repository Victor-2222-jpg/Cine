import { router } from 'expo-router';
import { EstadoVista } from '../components/ui/EstadoVista';

export default function NoEncontrado() {
  return (
    <EstadoVista
      icono="compass-outline"
      titulo="Página no encontrada"
      mensaje="La pantalla que buscas no existe."
      accion={{ titulo: 'Ir a la cartelera', onPress: () => router.replace('/') }}
    />
  );
}
