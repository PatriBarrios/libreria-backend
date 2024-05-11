import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../../util/dto/pagination.dto';
import { Subject } from '../subject/entities/subject.entity';
import { Author } from '../author/entities/author.entity';

@Injectable()
export class BookService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const { subject, authors, ...bookDetails } = createBookDto;
      const book = this.bookRepository.create({
        ...bookDetails,
        subject: await this.subjectRepository.findOneBy({ id: subject }),
        authors: await Promise.all(
          authors.map(
            async (author) =>
              await this.authorRepository.findOneBy({ id: author }),
          ),
        ),
      });
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.bookRepository.find({
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
  }

  async findOne(id: number) {
    try {
      const book = await this.bookRepository.findOneBy({ id });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const { subject, authors, ...bookDetails } = updateBookDto;
    const book = await this.bookRepository.preload({
      id,
      ...bookDetails,
      subject:
        (await this.subjectRepository.findOneBy({ id: subject })) ||
        (await this.findOne(id)).subject,
      authors: await Promise.all(
        authors.map(
          async (author) =>
            await this.authorRepository.findOneBy({ id: author }),
        ) || (await this.bookRepository.findOneBy({ id })).authors,
      ),
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // if (authors) {
      //   await queryRunner.manager.delete(BookAuthor, { book: id });
      //   book.authors = await Promise.all(
      //     authors.map(
      //       async (author) =>
      //         await this.authorRepository.findOneBy({ id: author }),
      //     ),
      //   );
      // }
      await queryRunner.manager.save(book);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      // return await this.bookRepository.save(book);
      return this.findOne(id);
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    this.bookRepository.remove(book);
    return book;
  }
}
