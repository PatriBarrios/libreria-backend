import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity';
import { Subject } from '../subject/entities/subject.entity';
import { Author } from '../author/entities/author.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Subject, Author]), AuthModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
