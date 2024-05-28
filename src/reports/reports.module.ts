import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsController } from './reports.controller';
import { Subject } from '../modules/subject/entities/subject.entity';
import { Author } from '../modules/author/entities/author.entity';
import { Book } from '../modules/book/entities/book.entity';
import { Loan } from '../modules/loan/entities/loan.entity';
import { User } from '../modules/user/entities/user.entity';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Author, Book, Subject, Loan, User]),
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [],
})
export class ReportsModule {}
