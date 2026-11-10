import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

/** Quita espacios al inicio y al final, para que "   " cuente como vacío. */
const Recortar = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

// En los DTO de actualización, skipNullProperties: false hace que null se valide (y se rechace con 400)
// en lugar de llegar a la base de datos y provocar un error 500.

export class CreateDirectorDto {
  @Recortar() @IsString() @IsNotEmpty() @MaxLength(100) Director: string;
}
export class UpdateDirectorDto extends PartialType(CreateDirectorDto, { skipNullProperties: false }) {}

export class CreateCategoriaDto {
  @Recortar() @IsString() @IsNotEmpty() @MaxLength(60) Categoria: string;
}
export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto, { skipNullProperties: false }) {}

export class CreatePeliculaDto {
  @Recortar() @IsString() @IsNotEmpty() @MaxLength(150) Titulo: string;
  @IsInt() @Min(1) IDDirector: number;
  /** Minutos (máximo 10 horas) */
  @IsInt() @Min(1) @Max(600) Duracion: number;
  @IsInt() @Min(1) IDCategoria: number;
  @IsOptional() @Recortar() @IsString() @MaxLength(2000) Sinopsis?: string;
}
export class UpdatePeliculaDto extends PartialType(CreatePeliculaDto, { skipNullProperties: false }) {}
