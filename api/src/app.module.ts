import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { Director } from './entities/director.entity';
import { Categoria } from './entities/categoria.entity';
import { PeliculasController } from './controllers/peliculas.controller';
import { DirectoresController } from './controllers/directores.controller';
import { CategoriasController } from './controllers/categorias.controller';
import { InicioController } from './controllers/inicio.controller';

@Module({
  imports: [
    // Busca api/.env junto al proyecto (funciona aunque arranques la API desde otra carpeta)
    ConfigModule.forRoot({ isGlobal: true, envFilePath: join(__dirname, '..', '.env') }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 3306),
        username: process.env.DB_USER ?? 'root',
        password: process.env.DB_PASS ?? '',
        database: process.env.DB_NAME ?? 'cine',
        entities: [Pelicula, Director, Categoria],
        synchronize: false, // las tablas se crean con database/cine.sql
      }),
    }),
    TypeOrmModule.forFeature([Pelicula, Director, Categoria]),
  ],
  controllers: [InicioController, PeliculasController, DirectoresController, CategoriasController],
})
export class AppModule {}
