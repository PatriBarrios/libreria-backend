import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { Loan } from './entities/loan.entity';
import { BookCopy } from '../book_copy/entities/book_copy.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, BookCopy, User])],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
