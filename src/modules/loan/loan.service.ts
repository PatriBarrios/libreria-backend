import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLoanDto, UpdateLoanDto } from './dto';
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
    const { bookCopy, user, startDate, endDate, ...loanDetails } =
      createLoanDto;

    if (endDate <= startDate)
      throw new BadRequestException('End date must be after start date');

    const tBookCopy = await this.bookCopyRepository.findOneBy({ id: bookCopy });
    if (!tBookCopy) throw new NotFoundException('Book copy not found');
    if (!tBookCopy.available)
      throw new BadRequestException('Book copy is not available');

    const loan = this.loanRepository.create({
      ...loanDetails,
      startDate,
      endDate,
      bookCopy: tBookCopy,
      user: await this.userRepository.findOneBy({ id: user }),
    });

    if (!loan.user) throw new NotFoundException('User not found');

    loan.bookCopy.available = false;
    const bookCopyId = loan.bookCopy.id;
    const updatedBookCopy = await this.bookCopyRepository.preload({
      id: bookCopyId,
      available: false,
    });
    await this.bookCopyRepository.save(updatedBookCopy);

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
    const { bookCopy, user, startDate, endDate, ...loanDetails } =
      updateLoanDto;

    let newBookCopy: BookCopy;
    let newUser: User;
    let newStartDate: Date;
    let newEndDate: Date;

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

    const tLoan = await this.findOne(id);

    if (startDate) newStartDate = startDate;
    else newStartDate = new Date(tLoan.startDate);

    if (endDate) newEndDate = endDate;
    else newEndDate = new Date(tLoan.endDate);

    if (newEndDate <= newStartDate)
      throw new BadRequestException('End date must be after start date');

    const loan = await this.loanRepository.preload({
      id,
      ...loanDetails,
      startDate: newStartDate,
      endDate: newEndDate,
      bookCopy: newBookCopy || (await this.findOne(id)).bookCopy,
      user: newUser || (await this.findOne(id)).user,
    });

    await this.loanRepository.save(loan);
    return loan;
  }

  async return(id: number) {
    const loan = await this.loanRepository.preload({
      id,
      pending: false,
    });

    if (!loan) throw new NotFoundException('Loan not found');

    const tLoan = await this.findOne(id);

    tLoan.bookCopy.available = true;
    tLoan.pending = false;
    const bookCopyId = tLoan.bookCopy.id;
    const updatedBookCopy = await this.bookCopyRepository.preload({
      id: bookCopyId,
      available: true,
    });
    await this.bookCopyRepository.save(updatedBookCopy);

    await this.loanRepository.save(loan);
    return tLoan;
  }

  async remove(id: number) {
    const loan = await this.findOne(id);
    await this.loanRepository.remove(loan);
    return loan;
  }
}
