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

@Entity()
export class BookCopy {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Book, (book) => book.bookCopies, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({
    nullable: false,
    default: true,
  })
  available: boolean;

  @OneToMany(() => Loan, (loan) => loan.bookCopy, { cascade: true })
  loans: Loan[];
}
