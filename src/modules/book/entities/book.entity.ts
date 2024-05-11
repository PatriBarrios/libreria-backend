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

@Entity()
export class Book {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'book_title', length: 100 })
  title: string;

  @Column({ name: 'book_year_edition' })
  yearEdition: number;

  @Column({ name: 'book_publisher', length: 100 })
  publisher: string;

  @Column({ name: 'book_country', length: 100 })
  country: string;

  @Column({ name: 'book_summary', length: 255 })
  summary: string;

  @Column({ name: 'book_number_pages' })
  numberPages: number;

  @ManyToOne(() => Subject, (subject) => subject.books, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

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
}
