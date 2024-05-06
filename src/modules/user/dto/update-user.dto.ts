import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsObject, IsEmail, Length } from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { Role } from '../../role/entities/role.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email: string;

  @Length(8)
  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsObject()
  role: Role;
}
