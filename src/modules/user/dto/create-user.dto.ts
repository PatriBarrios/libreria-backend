import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleType } from 'src/util/enum/roletype.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'newuser@gmail.com',
    description: 'User email',
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({
    example: 'mysecretpassword',
    description: 'User password',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Yankiel',
    description: 'User name',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'García Rodríguez',
    description: 'User last name',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  lastName: string;

  @ApiProperty({
    example: '98072248246',
    description: 'User DNI (11 digits)',
    uniqueItems: true,
  })
  @IsNumberString()
  @Length(11, 11)
  dni: string;

  @ApiProperty({
    example: 'User',
    description: 'User role',
  })
  @IsString()
  @IsIn([RoleType.ADMIN, RoleType.LIBRARIAN, RoleType.USER])
  role: string;
}
