import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto, UpdateBookDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DataSource, Repository } from 'typeorm';
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

      delete book.isDeleted;
      return book;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    const books = await this.bookRepository.find({
      where: { isDeleted: false },
    });
    books.map((item) => delete item.isDeleted);
    return books;
  }

  async findOne(id: number) {
    try {
      const book = await this.bookRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      await this.bookRepository.save(book);

      delete book.isDeleted;
      return book;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const thisBook = await this.findOne(id);
    const { subject, authors, ...bookDetails } = updateBookDto;
    const book = await this.bookRepository.preload({
      id,
      ...bookDetails,
      subject:
        (await this.subjectRepository.findOne({
          where: { id: subject, isDeleted: false },
        })) || thisBook.subject,
      authors: await Promise.all(
        authors.map(
          async (author) =>
            await this.authorRepository.findOne({
              where: { id: author, isDeleted: false },
            }),
        ) || thisBook.authors,
      ),
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(book);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOne(id);
    } catch (error) {
      console.log(error);
    }
  }

  async softDelete(id: number) {
    const book = await this.findOne(id);
    this.bookRepository.update(id, { isDeleted: true });
    return book;
  }
}
