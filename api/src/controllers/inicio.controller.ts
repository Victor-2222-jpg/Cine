import { Controller, Get } from '@nestjs/common';

// GET / -> resumen de la API (útil para comprobar que el servidor está arriba)
@Controller()
export class InicioController {
  @Get()
  inicio() {
    return {
      nombre: 'CineAPP API',
      estado: 'ok',
      endpoints: {
        peliculas: ['GET /peliculas?categoria=ID', 'GET /peliculas/:id', 'POST /peliculas', 'PUT /peliculas/:id', 'DELETE /peliculas/:id'],
        directores: ['GET /directores', 'GET /directores/:id', 'POST /directores', 'PUT /directores/:id', 'DELETE /directores/:id'],
        categorias: ['GET /categorias', 'GET /categorias/:id', 'POST /categorias', 'PUT /categorias/:id', 'DELETE /categorias/:id'],
        imagenes: ['GET /posters/:id.jpg', 'GET /fondos/:id.jpg'],
      },
    };
  }
}
