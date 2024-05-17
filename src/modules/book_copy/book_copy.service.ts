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
    await this.bookCopyRepository.save(bookCopy);

    delete bookCopy.isDeleted;
    return bookCopy;
  }

  async findAll(paginationDto: PaginationDto) {
    const bookCopies = await this.bookCopyRepository.find({
      where: { isDeleted: false },
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
    bookCopies.map((item) => delete item.isDeleted);
    return bookCopies;
  }

  async findOne(id: number) {
    const bookCopy = await this.bookCopyRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!bookCopy) {
      throw new NotFoundException('Book copy not found');
    }

    delete bookCopy.isDeleted;
    return bookCopy;
  }

  async update(id: number, updateBookCopyDto: UpdateBookCopyDto) {
    const thisBookCopy = await this.findOne(id);
    const { book } = updateBookCopyDto;
    const bookCopy = await this.bookCopyRepository.preload({
      id,
      book:
        (await this.bookRepository.findOne({
          where: { id: book, isDeleted: false },
        })) || thisBookCopy.book,
    });

    await this.bookCopyRepository.save(bookCopy);

    delete bookCopy.isDeleted;
    return bookCopy;
  }

  async softDelete(id: number) {
    const bookCopy = await this.findOne(id);
    this.bookCopyRepository.update(id, { isDeleted: true });
    return bookCopy;
  }
}
