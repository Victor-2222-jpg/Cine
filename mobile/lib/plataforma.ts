// Pequeñas diferencias entre celular y web (alertas, vibración).
import { Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function vibrar(tipo: 'seleccion' | 'exito' | 'error' = 'seleccion') {
  if (Platform.OS === 'web') return;
  const promesa =
    tipo === 'seleccion'
      ? Haptics.selectionAsync()
      : Haptics.notificationAsync(
          tipo === 'exito' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
        );
  promesa.catch(() => {});
}

export function avisar(titulo: string, mensaje: string) {
  if (Platform.OS === 'web') window.alert(`${titulo}\n\n${mensaje}`);
  else Alert.alert(titulo, mensaje);
}

export function confirmar(
  titulo: string,
  mensaje: string,
  textoAceptar = 'Aceptar',
  destructivo = false,
  textoCancelar = 'Cancelar',
): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${titulo}\n\n${mensaje}`));
  return new Promise((resolve) =>
    Alert.alert(
      titulo,
      mensaje,
      [
        { text: textoCancelar, style: 'cancel', onPress: () => resolve(false) },
        { text: textoAceptar, style: destructivo ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    ),
  );
}
