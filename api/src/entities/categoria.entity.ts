import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pelicula } from './pelicula.entity';

@Entity('Categorias')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'Identificador' })
  Identificador: number;

  @Column({ name: 'Categoria', length: 60 })
  Categoria: string;

  @OneToMany(() => Pelicula, (p) => p.categoria)
  peliculas: Pelicula[];
}
