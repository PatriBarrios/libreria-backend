import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../../book/entities/book.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Author {
  @ApiProperty({
    example: 4,
    description: 'Author ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'Manuel',
    description: 'Author name',
    maxLength: 100,
  })
  @Column({ name: 'author_name', length: 100 })
  name: string;

  @ApiProperty({
    example: 'García Rodríguez',
    description: 'Author last name',
    maxLength: 255,
  })
  @Column({ name: 'author_last_name', length: 255 })
  lastName: string;

  @ManyToMany(() => Book, (book) => book.authors, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  books: Book[];
}
