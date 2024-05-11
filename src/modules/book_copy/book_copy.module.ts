import { Module } from '@nestjs/common';
import { BookCopyService } from './book_copy.service';
import { BookCopyController } from './book_copy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCopy } from './entities/book_copy.entity';
import { Book } from '../book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookCopy, Book])],
  controllers: [BookCopyController],
  providers: [BookCopyService],
})
export class BookCopyModule {}
