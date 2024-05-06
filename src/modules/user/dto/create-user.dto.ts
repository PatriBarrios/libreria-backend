import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/modules/role/entities/role.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Length(8)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNumberString()
  @Length(11, 11)
  dni: string;

  @IsNotEmptyObject()
  role: Role;
}
