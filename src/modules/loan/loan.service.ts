import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { Repository } from 'typeorm';
import { BookCopy } from '../book_copy/entities/book_copy.entity';
import { User } from '../user/entities/user.entity';
import { PaginationDto } from 'src/util/dto/pagination.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(BookCopy)
    private readonly bookCopyRepository: Repository<BookCopy>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    const { bookCopy, user, ...loanDetails } = createLoanDto;

    const loan = this.loanRepository.create({
      ...loanDetails,
      bookCopy: await this.bookCopyRepository.findOneBy({ id: bookCopy }),
      user: await this.userRepository.findOneBy({ id: user }),
    });

    if (!loan.bookCopy) throw new NotFoundException('Book copy not found');
    if (!loan.user) throw new NotFoundException('User not found');

    await this.loanRepository.save(loan);
    return loan;
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.loanRepository.find({
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
  }

  async findOne(id: number) {
    const loan = await this.loanRepository.findOneBy({ id });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    return loan;
  }

  async update(id: number, updateLoanDto: UpdateLoanDto) {
    const { bookCopy, user, ...loanDetails } = updateLoanDto;

    let newBookCopy: BookCopy;
    let newUser: User;

    if (bookCopy) {
      newBookCopy = await this.bookCopyRepository.findOneBy({
        id: bookCopy,
      });
    }
    if (user) {
      newUser = await this.userRepository.findOneBy({ id: user });
    }

    if (bookCopy && !newBookCopy)
      throw new NotFoundException('Book copy not found');
    if (user && !newUser) throw new NotFoundException('User not found');

    const loan = await this.loanRepository.preload({
      id,
      ...loanDetails,
      bookCopy: newBookCopy || (await this.findOne(id)).bookCopy,
      user: newUser || (await this.findOne(id)).user,
    });

    if (!loan) throw new NotFoundException('Loan not found');

    await this.loanRepository.save(loan);
    return loan;
  }

  async remove(id: number) {
    const loan = await this.findOne(id);
    await this.loanRepository.remove(loan);
    return loan;
  }
}
