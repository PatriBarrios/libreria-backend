import * as PdfPrinter from 'pdfmake';
import { createWriteStream } from 'fs';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { Subject } from '../modules/subject/entities/subject.entity';
import { Author } from '../modules/author/entities/author.entity';
import { Book } from '../modules/book/entities/book.entity';
import { Auth } from '../modules/auth/decorators/auth.decorator';
import { RoleType } from '../util/enum/roletype.enum';
import { GetUser } from '../modules/auth/decorators/get-user.decorator';
import { User } from '../modules/user/entities/user.entity';
import { Loan } from '../modules/loan/entities/loan.entity';

@ApiBearerAuth()
@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Auth(RoleType.ADMIN)
  @Get('books-by-author/:id')
  async booksByAuthor(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const author = await this.authorRepository.findOneBy({ id });
    if (!author) throw new NotFoundException('Author not found');
    const books = await this.bookRepository.find({
      where: { isDeleted: false, authors: author },
    });
    const currentDate = new Date().toLocaleDateString();

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      content: [
        {
          text: `Report generated on ${currentDate}`,
          alignment: 'center',
          style: 'header',
        },
        {
          text: `By ${user.name} ${user.lastName}`,
          alignment: 'center',
          style: 'subHeader',
        },
        {
          text: `Books by ${author.name} ${author.lastName}`,
          fontSize: 25,
          alignment: 'center',
          style: 'title',
        },
        {
          layout: 'grid',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [
              ['ID', 'Title', 'Year of Edition'],
              ...books.map((book) => [book.id, book.title, book.yearEdition]),
            ],
          },
          margin: [0, 20, 0, 10],
        },
      ],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 12,
      },
      styles: {
        header: {
          bold: true,
          fontSize: 16,
          margin: [0, 0, 0, 10],
        },
        subHeader: {
          italic: true,
          fontSize: 14,
          margin: [0, 10, 0, 0],
        },
        title: {
          bold: true,
          fontSize: 30,
          margin: [0, 20, 0, 10],
        },
      },
    };

    const options = {};
    const fileName = `books-by-${author.name}-report.pdf`;
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);

    const tempStream = createWriteStream(fileName);
    pdfDoc.pipe(tempStream);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

    tempStream.on('finish', () => {
      res.download(fileName);
    });

    pdfDoc.end();
  }

  @Auth(RoleType.ADMIN)
  @Get('books-by-subject/:id')
  async booksBySubject(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const subject = await this.subjectRepository.findOneBy({ id });
    if (!subject) throw new NotFoundException('Subject not found');
    const books = await this.bookRepository.find({
      where: { isDeleted: false, subject: subject },
    });
    const currentDate = new Date().toLocaleDateString();

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      content: [
        {
          text: `Report generated on ${currentDate}`,
          alignment: 'center',
          style: 'header',
        },
        {
          text: `By ${user.name} ${user.lastName}`,
          alignment: 'center',
          style: 'subHeader',
        },
        {
          text: `Books about ${subject.name}`,
          fontSize: 25,
          alignment: 'center',
          style: 'title',
        },
        {
          layout: 'grid',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [
              ['ID', 'Title', 'Year of Edition'],
              ...books.map((book) => [book.id, book.title, book.yearEdition]),
            ],
          },
          margin: [0, 20, 0, 10],
        },
      ],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 12,
      },
      styles: {
        header: {
          bold: true,
          fontSize: 16,
          margin: [0, 0, 0, 10],
        },
        subHeader: {
          italic: true,
          fontSize: 14,
          margin: [0, 10, 0, 0],
        },
        title: {
          bold: true,
          fontSize: 30,
          margin: [0, 20, 0, 10],
        },
      },
    };

    const options = {};
    const fileName = `books-about-${subject.name}-report.pdf`;
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    const tempStream = createWriteStream(fileName);
    pdfDoc.pipe(tempStream);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

    tempStream.on('finish', () => {
      res.download(fileName);
    });

    pdfDoc.end();
  }

  @Auth(RoleType.ADMIN)
  @Get('loans-by-user/:id')
  async loansByUser(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    const userr = await this.userRepository.findOneBy({ id });
    if (!userr) throw new NotFoundException('User not found');
    const loans = await this.loanRepository.findBy({ user: userr });
    const currentDate = new Date().toLocaleDateString();

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      content: [
        {
          text: `Report generated on ${currentDate}`,
          alignment: 'center',
          style: 'header',
        },
        {
          text: `By ${user.name} ${user.lastName}`,
          alignment: 'center',
          style: 'subHeader',
        },
        {
          text: `Loans of ${userr.email}`,
          fontSize: 25,
          alignment: 'center',
          style: 'title',
        },
        {
          layout: 'grid',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['ID', 'Book', 'Start Date', 'End Date'],
              ...loans.map((loan) => [
                loan.id,
                loan.bookCopy.book.title,
                loan.startDate,
                loan.endDate,
              ]),
            ],
          },
          margin: [0, 20, 0, 10],
        },
      ],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 12,
      },
      styles: {
        header: {
          bold: true,
          fontSize: 16,
          margin: [0, 0, 0, 10],
        },
        subHeader: {
          italic: true,
          fontSize: 14,
          margin: [0, 10, 0, 0],
        },
        title: {
          bold: true,
          fontSize: 30,
          margin: [0, 20, 0, 10],
        },
      },
    };

    const options = {};
    const fileName = `loans-of-${userr.email}-report.pdf`;
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    const tempStream = createWriteStream(fileName);
    pdfDoc.pipe(tempStream);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

    tempStream.on('finish', () => {
      res.download(fileName);
    });

    pdfDoc.end();
  }
}
