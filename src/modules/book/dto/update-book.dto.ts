import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
} from 'class-validator';
import { Subject } from '../../subject/entities/subject.entity';
import { Author } from '../../author/entities/author.entity';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  yearEdition: number;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsNumber()
  @IsNotEmpty()
  numberPages: number;

  @IsNotEmptyObject()
  subject: Subject;

  @IsNotEmpty()
  @IsArray()
  authors: Author[];
}
