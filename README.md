# CineAPP

App móvil de cine hecha con **Expo (React Native)**, una **API en NestJS** y una base de datos **MySQL**.

**Requisitos:** Node.js 18 o superior, MySQL 8 y la app **Expo Go** en el celular.

```
database/   cine.sql (crea todo) y actualizacion.sql (solo actualiza títulos y sinopsis)
api/        NestJS + TypeORM; también sirve las imágenes (api/public)
mobile/     Expo + Expo Router
```

## 1. Base de datos

En MySQL Workbench abre y ejecuta `database/cine.sql`. Crea la base `cine` con las tablas:

- `Peliculas(Identificador, Titulo, IDDirector, Duracion, IDCategoria, Sinopsis)`
- `Directores(IDDirector, Director)`
- `Categorias(Identificador, Categoria)`

> ¿Ya tenías la base creada? Ejecuta `database/actualizacion.sql`: no borra nada, solo pone los títulos oficiales en México y sinopsis completas.

## 2. API (NestJS)

En `api/.env` pon tu contraseña de MySQL (`DB_PASS`). Después:

```bash
cd api
npm run start:dev
```

| Ruta | Descripción |
|---|---|
| `GET /` | Resumen de la API |
| `GET /peliculas` (`?categoria=ID`) | Películas con director, categoría, `Poster` y `Fondo` |
| `GET /peliculas/:id` | Detalle de una película |
| `POST / PUT / DELETE /peliculas` | CRUD de películas |
| `/directores`, `/categorias` | CRUD completo de directores y categorías |
| `GET /posters/:id.jpg`, `GET /fondos/:id.jpg` | Imágenes de cada película |

**Validación:** los datos inválidos responden `400` (por ejemplo, un director que no existe o un título vacío), y borrar un director o una categoría que todavía tiene películas responde `409`.

**Imágenes:** viven en `api/public/posters` y `api/public/fondos`, nombradas con el `Identificador` de la película (`1.jpg`, `2.jpg`...). `Poster` y `Fondo` **no son columnas** de la tabla: la API los calcula si existe el archivo. Si agregas una película sin imagen, la app le genera un póster automático.

## 3. App móvil (Expo)

En `mobile/.env` pon la IP de tu computadora (`ipconfig` → Dirección IPv4). El celular y la computadora tienen que estar en la misma red WiFi.

```bash
cd mobile
npx expo start -c
```

Escanea el QR con **Expo Go**, o presiona `w` para abrirla en el navegador.

### Pantallas

| Pestaña / pantalla | Qué hace |
|---|---|
| **Cartelera** | Carrusel de películas destacadas, buscador, filtro por categoría y cuadrícula con pósters |
| **Detalle** | Imagen de fondo, póster, director, duración, sala, sinopsis, horarios de 5 días y películas relacionadas |
| **Asientos** | Mapa de la sala con asientos libres, ocupados y seleccionados (hasta 8) |
| **Confirmar** | Resumen de la compra con cargo por servicio (pago simulado) |
| **Boleto** | Boleto digital con código de barras |
| **Salas** | Simulación en tiempo real: qué se proyecta en cada sala, progreso de la función, ocupación y programación del día |
| **Mis boletos** | Boletos próximos e historial (se guardan en el teléfono) |

### Cómo funciona la simulación

- 5 salas: **IMAX, VIP, 4DX, 3D y Tradicional**, cada una con su precio y su distribución de asientos.
- Las películas se reparten entre las salas, y cada sala alterna sus películas de 11:00 a 22:45, con 20 minutos de limpieza entre funciones.
- La ocupación depende de la hora y del día: las funciones de noche y de fin de semana se llenan más.
- Los asientos que compras quedan marcados en la sala y cuentan en la ocupación.

---

Pósters e imágenes: [The Movie Database (TMDB)](https://www.themoviedb.org/). Este proyecto no está respaldado ni certificado por TMDB.
"# CineApp" 
