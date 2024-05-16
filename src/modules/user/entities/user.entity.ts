import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Loan } from '../../loan/entities/loan.entity';
import { Sanction } from '../../sanction/entities/sanction.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    example: 4,
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: 'newuser@gmail.com',
    description: 'User email',
    uniqueItems: true,
  })
  @Column({ unique: true, length: 100 })
  email: string;

  @ApiProperty({
    example: 'mysecretpassword',
    description: 'User password',
  })
  @Column({ length: 255, select: false })
  password: string;

  @ApiProperty({
    example: 'Yankiel',
    description: 'User name',
    maxLength: 100,
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    example: 'García Rodríguez',
    description: 'User last name',
    maxLength: 255,
  })
  @Column({ length: 255 })
  lastName: string;

  @ApiProperty({
    example: '98072248246',
    description: 'User DNI (11 digits)',
    uniqueItems: true,
  })
  @Column({ length: 11, unique: true })
  dni: string;

  @ApiProperty({
    example: 'User',
    description: 'User role',
  })
  @Column()
  role: string;

  @OneToMany(() => Loan, (loan) => loan.user, { cascade: true })
  loans: Loan[];

  @OneToMany(() => Sanction, (sanction) => sanction.user, {
    cascade: true,
  })
  sanctions: Sanction[];
}
