import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Loan } from '../../loan/entities/loan.entity';
import { Role } from '../../role/entities/role.entity';
import { Sanction } from '../../sanction/entities/sanction.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 11, unique: true })
  dni: string;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Loan, (loan) => loan.user, { cascade: true })
  loans: Loan[];

  @OneToMany(() => Sanction, (sanction) => sanction.user, {
    cascade: true,
  })
  sanctions: Sanction[];
}
