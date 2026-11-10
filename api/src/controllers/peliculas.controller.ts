import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from '../entities/pelicula.entity';
import { Director } from '../entities/director.entity';
import { Categoria } from '../entities/categoria.entity';
import { CreatePeliculaDto, UpdatePeliculaDto } from '../dto/dtos';

@Controller('peliculas')
export class PeliculasController {
  constructor(
    @InjectRepository(Pelicula) private repo: Repository<Pelicula>,
    @InjectRepository(Director) private directores: Repository<Director>,
    @InjectRepository(Categoria) private categorias: Repository<Categoria>,
  ) {}

  // GET /peliculas             -> todas
  // GET /peliculas?categoria=1 -> filtradas por categoría
  @Get()
  findAll(@Query('categoria') categoria?: string) {
    // Se valida a mano: el ValidationPipe global convertiría un parámetro ausente en NaN.
    let idCategoria: number | undefined;
    if (categoria !== undefined && categoria !== '') {
      idCategoria = Number(categoria);
      if (!Number.isInteger(idCategoria) || idCategoria < 1) {
        throw new BadRequestException('El parámetro "categoria" debe ser un número entero positivo.');
      }
    }
    return this.repo.find({
      where: idCategoria !== undefined ? { IDCategoria: idCategoria } : {},
      relations: { director: true, categoria: true },
      order: { Titulo: 'ASC' },
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const p = await this.repo.findOne({
      where: { Identificador: id },
      relations: { director: true, categoria: true },
    });
    if (!p) throw new NotFoundException('Película no encontrada');
    return p;
  }

  @Post()
  async create(@Body() dto: CreatePeliculaDto) {
    await this.validarRelaciones(dto);
    const p = await this.repo.save(this.repo.create(dto));
    return this.findOne(p.Identificador);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePeliculaDto) {
    if (!Object.keys(dto).length) throw new BadRequestException('Envía al menos un campo para actualizar.');
    await this.findOne(id);
    await this.validarRelaciones(dto);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { eliminado: true };
  }

  /** Evita el error 500 de llave foránea: responde 400 si el director o la categoría no existen. */
  private async validarRelaciones(dto: { IDDirector?: number; IDCategoria?: number }) {
    if (dto.IDDirector !== undefined && !(await this.directores.existsBy({ IDDirector: dto.IDDirector }))) {
      throw new BadRequestException(`No existe un director con IDDirector ${dto.IDDirector}.`);
    }
    if (dto.IDCategoria !== undefined && !(await this.categorias.existsBy({ Identificador: dto.IDCategoria }))) {
      throw new BadRequestException(`No existe una categoría con Identificador ${dto.IDCategoria}.`);
    }
  }
}
