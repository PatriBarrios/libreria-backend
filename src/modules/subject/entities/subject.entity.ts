import { ApiProperty } from '@nestjs/swagger';
import { Book } from 'src/modules/book/entities/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @ApiProperty({
    example: 4,
    description: 'Subject ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'Terror',
    description: 'Subject name',
  })
  @Column({ name: 'subject_name', unique: true, length: 100 })
  name: string;

  @OneToMany(() => Book, (book) => book.subject, { cascade: true })
  books: Book[];
}
