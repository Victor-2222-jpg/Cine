import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';
import { Pelicula } from '../entities/pelicula.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../dto/dtos';

@Controller('categorias')
export class CategoriasController {
  constructor(
    @InjectRepository(Categoria) private repo: Repository<Categoria>,
    @InjectRepository(Pelicula) private peliculas: Repository<Pelicula>,
  ) {}

  @Get()
  findAll() {
    return this.repo.find({ order: { Categoria: 'ASC' } });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const c = await this.repo.findOne({ where: { Identificador: id }, relations: { peliculas: true } });
    if (!c) throw new NotFoundException('Categoría no encontrada');
    return c;
  }

  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.repo.save(this.repo.create(dto));
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    if (!Object.keys(dto).length) throw new BadRequestException('Envía al menos un campo para actualizar.');
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    const total = await this.peliculas.countBy({ IDCategoria: id });
    if (total) {
      throw new ConflictException(`No se puede eliminar: la categoría tiene ${total} película(s) registradas.`);
    }
    await this.repo.delete(id);
    return { eliminado: true };
  }
}
