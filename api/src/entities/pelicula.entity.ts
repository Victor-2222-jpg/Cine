import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Director } from './director.entity';
import { Categoria } from './categoria.entity';
import { rutaImagen } from '../imagenes';

@Entity('Peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn({ name: 'Identificador' })
  Identificador: number;

  @Column({ name: 'Titulo', length: 150 })
  Titulo: string;

  @Column({ name: 'IDDirector' })
  IDDirector: number;

  @Column({ name: 'Duracion' })
  Duracion: number;

  @Column({ name: 'IDCategoria' })
  IDCategoria: number;

  @Column({ name: 'Sinopsis', type: 'text', nullable: true })
  Sinopsis: string;

  @ManyToOne(() => Director, (d) => d.peliculas)
  @JoinColumn({ name: 'IDDirector' })
  director: Director;

  @ManyToOne(() => Categoria, (c) => c.peliculas)
  @JoinColumn({ name: 'IDCategoria' })
  categoria: Categoria;

  // Campos calculados (NO son columnas de la tabla): rutas de las imágenes que sirve la API.
  Poster: string | null;
  Fondo: string | null;

  @AfterLoad()
  asignarImagenes() {
    this.Poster = rutaImagen('posters', this.Identificador);
    this.Fondo = rutaImagen('fondos', this.Identificador);
  }
}
