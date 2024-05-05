import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'author_name', length: 100 })
  name: string;

  @Column({ name: 'author_last_name', length: 255 })
  lastName: string;
}
