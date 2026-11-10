// Colores y medidas de la app (diseño sencillo, tema claro).

export const colores = {
  fondo: '#F2F2F2',
  superficie: '#FFFFFF',
  elevado: '#FFFFFF',
  elevadoAlto: '#E6E6E6',
  borde: '#CCCCCC',
  bordeFuerte: '#999999',

  texto: '#222222',
  secundario: '#555555',
  tenue: '#888888',

  primario: '#1E6FD9',
  primarioSuave: '#DCE9FA',
  dorado: '#B7791F',
  doradoSuave: '#FDF3DC',
  exito: '#2E8B3A',
  exitoSuave: '#E3F4E5',
  advertencia: '#C77700',
  advertenciaSuave: '#FFF4D6',
  peligro: '#D32F2F',
} as const;

// Se usa la fuente normal del sistema
export const fuentes = {
  regular: undefined,
  medio: undefined,
  semibold: undefined,
  bold: undefined,
  extrabold: undefined,
} as const;

export const radio = { s: 4, m: 4, l: 6, xl: 6, xxl: 6, total: 999 } as const;

export const ANCHO_MAXIMO = 900;
