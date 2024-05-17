import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Subject } from '../../subject/entities/subject.entity';
import { Author } from '../../author/entities/author.entity';
import { BookCopy } from '../../book_copy/entities/book_copy.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Book {
  @ApiProperty({
    example: 4,
    description: 'Book ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'Harry Potter',
    description: 'Book title',
    maxLength: 100,
  })
  @Column({ name: 'book_title', length: 100 })
  title: string;

  @ApiProperty({
    example: 2004,
    description: 'Year of edition',
  })
  @Column({ name: 'book_year_edition' })
  yearEdition: number;

  @ApiProperty({
    example: 'Salamandra Scholastic',
    description: 'Book publisher',
    maxLength: 100,
  })
  @Column({ name: 'book_publisher', length: 100 })
  publisher: string;

  @ApiProperty({
    example: 'United Kingdom',
    description: 'Book country',
    maxLength: 100,
  })
  @Column({ name: 'book_country', length: 100 })
  country: string;

  @ApiProperty({
    example: 'An orphan boy has magical powers and a stupid uncle',
    description: 'Book summary',
    maxLength: 100,
  })
  @Column({ name: 'book_summary', length: 255 })
  summary: string;

  @ApiProperty({
    example: 326,
    description: 'Number of pages',
  })
  @Column({ name: 'book_number_pages' })
  numberPages: number;

  @ApiProperty({
    type: () => Subject,
  })
  @ManyToOne(() => Subject, (subject) => subject.books, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ApiProperty({
    type: () => [Author],
  })
  @ManyToMany(() => Author, (author) => author.books, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinTable({
    name: 'book_author',
    joinColumn: { name: 'book_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'author_id', referencedColumnName: 'id' },
  })
  authors: Author[];

  @OneToMany(() => BookCopy, (bookCopy) => bookCopy.book, { cascade: true })
  bookCopies: BookCopy[];

  @Column({
    default: false,
  })
  isDeleted: boolean;
}
