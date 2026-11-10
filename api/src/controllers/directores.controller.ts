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
import { Director } from '../entities/director.entity';
import { Pelicula } from '../entities/pelicula.entity';
import { CreateDirectorDto, UpdateDirectorDto } from '../dto/dtos';

@Controller('directores')
export class DirectoresController {
  constructor(
    @InjectRepository(Director) private repo: Repository<Director>,
    @InjectRepository(Pelicula) private peliculas: Repository<Pelicula>,
  ) {}

  @Get()
  findAll() {
    return this.repo.find({ order: { Director: 'ASC' } });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const d = await this.repo.findOne({ where: { IDDirector: id }, relations: { peliculas: true } });
    if (!d) throw new NotFoundException('Director no encontrado');
    return d;
  }

  @Post()
  create(@Body() dto: CreateDirectorDto) {
    return this.repo.save(this.repo.create(dto));
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDirectorDto) {
    if (!Object.keys(dto).length) throw new BadRequestException('Envía al menos un campo para actualizar.');
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.findOne(id);
    const total = await this.peliculas.countBy({ IDDirector: id });
    if (total) {
      throw new ConflictException(`No se puede eliminar: el director tiene ${total} película(s) registradas.`);
    }
    await this.repo.delete(id);
    return { eliminado: true };
  }
}
