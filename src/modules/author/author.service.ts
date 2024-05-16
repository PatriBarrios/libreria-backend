import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAuthorDto, UpdateAuthorDto } from './dto';
import { Author } from './entities/author.entity';
import { PaginationDto } from '../../util/dto/pagination.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(author);
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.authorRepository.find({
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
  }

  async findOne(id: number) {
    const author = await this.authorRepository.findOneBy({ id: id });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.authorRepository.preload({
      id,
      ...updateAuthorDto,
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }
    await this.authorRepository.save(author);
    return author;
  }

  async remove(id: number) {
    const author = await this.findOne(id);
    this.authorRepository.remove(author);
    return author;
  }
}
