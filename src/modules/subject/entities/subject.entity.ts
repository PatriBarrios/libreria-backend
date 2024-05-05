import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'subject_name', unique: true, length: 100 })
  name: string;
}
