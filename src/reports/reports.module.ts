import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsController } from './reports.controller';
import { Subject } from '../modules/subject/entities/subject.entity';
import { Author } from '../modules/author/entities/author.entity';
import { Book } from '../modules/book/entities/book.entity';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book, Subject]), AuthModule],
  controllers: [ReportsController],
  providers: [],
})
export class ReportsModule {}
