import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1900)
  yearEdition: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  publisher: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  summary: string;

  @IsInt()
  @IsPositive()
  numberPages: number;

  @IsInt()
  @IsPositive()
  subject: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  authors: number[];
}
