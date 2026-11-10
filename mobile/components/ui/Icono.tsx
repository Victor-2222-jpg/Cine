import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type NombreIcono = ComponentProps<typeof Ionicons>['name'];

export function Icono(props: ComponentProps<typeof Ionicons>) {
  return <Ionicons {...props} />;
}
