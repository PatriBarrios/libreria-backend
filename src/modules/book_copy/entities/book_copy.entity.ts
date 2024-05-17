import { Loan } from '../../loan/entities/loan.entity';
import { Book } from '../../book/entities/book.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BookCopy {
  @ApiProperty({
    example: 4,
    description: 'Book Copy ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    type: () => Book,
  })
  @ManyToOne(() => Book, (book) => book.bookCopies, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ApiProperty({
    default: true,
    description: 'Is available?',
  })
  @Column({
    nullable: false,
    default: true,
  })
  available: boolean;

  @OneToMany(() => Loan, (loan) => loan.bookCopy, { cascade: true })
  loans: Loan[];
}
