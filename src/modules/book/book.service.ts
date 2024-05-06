import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const user = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(user);
  }

  async findAll() {
    return await this.bookRepository.find({
      relations: ['subject', 'authors'],
    });
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
      relations: ['subject', 'authors'],
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.update(id, updateBookDto);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return 'Updated';
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id: id },
      relations: ['subject', 'authors'],
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    this.bookRepository.remove(book);
    return book;
  }
}
