import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'role_name', unique: true, length: 100 })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
