import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({
    example: 2,
    description: 'Book copy ID',
  })
  @IsInt()
  @IsPositive()
  bookCopy: number;

  @ApiProperty({
    example: 4,
    description: 'User ID',
  })
  @IsInt()
  @IsPositive()
  user: number;

  @ApiProperty({
    example: '2024/03/10',
    description: 'Start date',
  })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    example: '2024/03/12',
    description: 'End date',
  })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  pending: boolean;
}
