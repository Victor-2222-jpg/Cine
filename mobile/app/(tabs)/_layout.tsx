import { ColorValue, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import { Icono, NombreIcono } from '../../components/ui/Icono';
import { boletoVigente, useBoletos } from '../../lib/boletos';
import { colores, fuentes } from '../../lib/tema';
import { useAhora } from '../../lib/useAhora';

const icono =
  (activo: NombreIcono, inactivo: NombreIcono) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Icono name={focused ? activo : inactivo} size={23} color={typeof color === 'string' ? color : colores.tenue} />
  );

export default function LayoutPestanas() {
  const { boletos } = useBoletos();
  const ahora = useAhora(60000);
  const pendientes = boletos.filter((b) => boletoVigente(b, ahora)).length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colores.primario,
        tabBarInactiveTintColor: colores.tenue,
        tabBarStyle: {
          backgroundColor: colores.superficie,
          borderTopColor: colores.borde,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: { fontFamily: fuentes.semibold, fontSize: 11 },
        sceneStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Cartelera', tabBarIcon: icono('film', 'film-outline') }} />
      <Tabs.Screen
        name="boletos"
        options={{
          title: 'Mis boletos',
          tabBarIcon: icono('ticket', 'ticket-outline'),
          tabBarBadge: pendientes > 0 ? pendientes : undefined,
          tabBarBadgeStyle: { backgroundColor: colores.primario, fontFamily: fuentes.bold, fontSize: 10 },
        }}
      />
    </Tabs>
  );
}
