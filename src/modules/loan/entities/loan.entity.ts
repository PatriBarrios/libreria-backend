import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BookCopy } from '../../book_copy/entities/book_copy.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Loan {
  @ApiProperty({
    example: 4,
    description: 'Loan ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    type: () => BookCopy,
  })
  @ManyToOne(() => BookCopy, (bookCopy) => bookCopy.loans, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'book_copy_id' })
  bookCopy: BookCopy;

  @ApiProperty({
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.loans, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    example: new Date('2024/03/10'),
    description: 'Start date',
  })
  @Column('date')
  startDate: Date;

  @ApiProperty({
    example: new Date('2024/03/12'),
    description: 'End date',
  })
  @Column('date')
  endDate: Date;

  @ApiPropertyOptional({
    default: true,
    description: 'Is pending?',
  })
  @Column({
    default: true,
  })
  pending: boolean;
}
