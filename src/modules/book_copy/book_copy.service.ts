import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookCopyDto, UpdateBookCopyDto } from './dto';
import { BookCopy } from './entities/book_copy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/util/dto/pagination.dto';
import { Book } from '../book/entities/book.entity';

@Injectable()
export class BookCopyService {
  constructor(
    @InjectRepository(BookCopy)
    private readonly bookCopyRepository: Repository<BookCopy>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookCopyDto: CreateBookCopyDto) {
    const { book } = createBookCopyDto;
    const bookCopy = this.bookCopyRepository.create({
      book: await this.bookRepository.findOneBy({ id: book }),
    });
    return this.bookCopyRepository.save(bookCopy);
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.bookCopyRepository.find({
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
  }

  async findOne(id: number) {
    const bookCopy = await this.bookCopyRepository.findOneBy({ id });

    if (!bookCopy) {
      throw new NotFoundException('Book copy not found');
    }

    return bookCopy;
  }

  async update(id: number, updateBookCopyDto: UpdateBookCopyDto) {
    const { book } = updateBookCopyDto;
    const bookCopy = await this.bookCopyRepository.preload({
      id,
      book:
        (await this.bookRepository.findOneBy({ id: book })) ||
        (await this.findOne(id)).book,
    });

    if (!bookCopy) {
      throw new NotFoundException('User not found');
    }
    await this.bookCopyRepository.save(bookCopy);
    return bookCopy;
  }

  async remove(id: number) {
    const bookCopy = await this.findOne(id);
    this.bookCopyRepository.remove(bookCopy);
    return bookCopy;
  }
}
