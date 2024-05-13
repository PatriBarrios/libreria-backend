import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Sanction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('date')
  startDate: Date;

  @Column('int', {
    nullable: true,
  })
  duration?: number;

  @Column('date', {
    nullable: true,
  })
  endDate?: Date;

  @ManyToOne(() => User, (user) => user.sanctions, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    default: true,
  })
  isActive: boolean;
}
