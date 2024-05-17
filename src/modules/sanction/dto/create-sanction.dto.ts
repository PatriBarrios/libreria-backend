import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class CreateSanctionDto {
  @ApiProperty({
    example: new Date('2024/03/10'),
    description: 'Start date',
  })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiPropertyOptional({
    example: 1,
    description: 'Duration (months)',
    minimum: 1,
    maximum: 12,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({
    example: new Date('2024/04/10'),
    description: 'End date',
  })
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    example: 4,
    description: 'User ID',
  })
  @IsInt()
  @IsPositive()
  user: number;
}
