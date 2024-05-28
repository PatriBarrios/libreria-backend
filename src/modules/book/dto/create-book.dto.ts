import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'Harry Potter',
    description: 'Book title',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 2004,
    description: 'Year of edition',
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1900)
  @Max(2024)
  yearEdition: number;

  @ApiProperty({
    example: 'Salamandra Scholastic',
    description: 'Book publisher',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  publisher: string;

  @ApiProperty({
    example: 'United Kingdom',
    description: 'Book country',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @ApiProperty({
    example: 'An orphan boy has magical powers and a stupid uncle',
    description: 'Book summary',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  summary: string;

  @ApiProperty({
    example: 326,
    description: 'Number of pages',
  })
  @IsInt()
  @IsPositive()
  numberPages: number;

  @ApiProperty({
    example: 2,
    description: 'Subject ID',
  })
  @IsInt()
  @IsPositive()
  subject: number;

  @ApiProperty({
    example: [2, 4],
    description: 'Authors IDs',
    type: [Number],
  })
  @IsNotEmpty()
  @IsArray()
  @MinLength(1)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  authors: number[];
}
