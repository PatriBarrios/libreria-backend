import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { Author } from './entities/author.entity';
import { Book } from '../book/entities/book.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book]), AuthModule],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
