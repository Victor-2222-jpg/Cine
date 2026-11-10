import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pelicula } from './pelicula.entity';

@Entity('Directores')
export class Director {
  @PrimaryGeneratedColumn({ name: 'IDDirector' })
  IDDirector: number;

  @Column({ name: 'Director', length: 100 })
  Director: string;

  @OneToMany(() => Pelicula, (p) => p.director)
  peliculas: Pelicula[];
}
