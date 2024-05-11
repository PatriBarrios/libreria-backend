import { Role } from 'src/modules/role/entities/role.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_email', unique: true, length: 100 })
  email: string;

  @Column({ name: 'user_password', length: 255 })
  password: string;

  @Column({ name: 'user_name', length: 100 })
  name: string;

  @Column({ name: 'user_last_name', length: 255 })
  lastName: string;

  @Column({ name: 'user_dni', length: 11, unique: true })
  dni: string;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
