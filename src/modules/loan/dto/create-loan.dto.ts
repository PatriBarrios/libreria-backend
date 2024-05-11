import { IsDate, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateLoanDto {
  @IsInt()
  @IsPositive()
  bookCopy: number;

  @IsInt()
  @IsPositive()
  user: number;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
