import { Loan } from '../../loan/entities/loan.entity';
import { Book } from '../../book/entities/book.entity';
import {
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

  @OneToMany(() => Loan, (loan) => loan.bookCopy, { cascade: true })
  loans: Loan[];
}
