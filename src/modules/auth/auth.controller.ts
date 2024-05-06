import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signup(signUpDTO);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signin(@Body() signInDTO: SignInDTO) {
    return this.authService.signin(signInDTO);
  }
}
