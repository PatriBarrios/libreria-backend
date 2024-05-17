import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateBookCopyDto {
  @ApiProperty({
    example: 4,
    description: 'Book ID',
  })
  @IsInt()
  @IsPositive()
  book: number;
}
