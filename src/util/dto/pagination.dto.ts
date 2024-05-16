import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'Number of rows to show',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Number of rows to skip',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number;
}
