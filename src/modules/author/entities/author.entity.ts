import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'author_name', length: 100 })
  name: string;

  @Column({ name: 'author_last_name', length: 255 })
  lastName: string;

  @ManyToMany(() => Book, (book) => book.authors, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  books: Book[];
}
