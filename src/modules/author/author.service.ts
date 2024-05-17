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
    await this.authorRepository.save(author);
    delete author.isDeleted;
    return author;
  }

  async findAll(paginationDto: PaginationDto) {
    const authors = await this.authorRepository.find({
      where: { isDeleted: false },
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
    authors.map((item) => delete item.isDeleted);
    return authors;
  }

  async findOne(id: number) {
    const author = await this.authorRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    delete author.isDeleted;
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    await this.findOne(id);
    const author = await this.authorRepository.preload({
      id,
      ...updateAuthorDto,
    });

    await this.authorRepository.save(author);
    delete author.isDeleted;
    return author;
  }

  async softDelete(id: number) {
    const author = await this.findOne(id);
    this.authorRepository.update(id, { isDeleted: true });
    return author;
  }
}
