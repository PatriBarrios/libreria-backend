import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signup(signUpDTO);
  }

  @Post('signin')
  async signin(@Body() signInDTO: SignInDTO) {
    return this.authService.signin(signInDTO);
  }
}
