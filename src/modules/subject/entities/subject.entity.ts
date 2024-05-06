import { Book } from 'src/modules/book/entities/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'subject_name', unique: true, length: 100 })
  name: string;

  @OneToMany(() => Book, (book) => book.subject)
  books: Book[];
}
