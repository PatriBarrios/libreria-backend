import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
} from 'class-validator';
import { Author } from '../../author/entities/author.entity';
import { Subject } from '../../subject/entities/subject.entity';

export class CreateBookDto {
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
