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
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  duration?: number;

  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  endDate?: Date;

  @IsInt()
  @IsPositive()
  user: number;
}
