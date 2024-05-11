import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BookCopy } from '../../book_copy/entities/book_copy.entity';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => BookCopy, (bookCopy) => bookCopy.loans, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'book_copy_id' })
  bookCopy: BookCopy;

  @ManyToOne(() => User, (user) => user.loans, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;
}
