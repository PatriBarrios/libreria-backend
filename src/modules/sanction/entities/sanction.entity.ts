import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Sanction {
  @ApiProperty({
    example: 4,
    description: 'Sanction ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    example: new Date('2024/03/10'),
    description: 'Start date',
  })
  @Column('date')
  startDate: Date;

  @ApiPropertyOptional({
    example: 1,
    description: 'Duration (months)',
    minimum: 1,
    maximum: 12,
  })
  @Column('int', {
    nullable: true,
  })
  duration?: number;

  @ApiPropertyOptional({
    example: new Date('2024/04/10'),
    description: 'End date',
  })
  @Column('date', {
    nullable: true,
  })
  endDate?: Date;

  @ApiProperty({
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.sanctions, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    default: true,
    description: 'Is active?',
  })
  @Column({
    default: true,
  })
  isActive: boolean;
}
