import { IsInt, IsPositive } from 'class-validator';

export class CreateBookCopyDto {
  @IsInt()
  @IsPositive()
  book: number;
}
