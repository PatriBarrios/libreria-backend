import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class SignUpDTO {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'User email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'mysecretpassword',
    description: 'User password',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Yankiel',
    description: 'User name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Yong Martínez',
    description: 'User last name',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: '98072248246',
    description: 'User DNI (11 digits)',
  })
  @IsNumberString()
  @Length(11, 11)
  dni: string;
}
