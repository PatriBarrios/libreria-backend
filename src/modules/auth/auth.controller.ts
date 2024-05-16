import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDTO } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { Auth } from './decorators/auth.decorator';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
    description: 'Sign Up OK',
    schema: {
      properties: {
        id: {
          type: 'number',
          description: 'The user id',
          example: 4,
          uniqueItems: true,
        },
        email: {
          type: 'string',
          example: 'newuser@gmail.com',
          description: 'User email',
          uniqueItems: true,
        },
        name: {
          type: 'string',
          example: 'Yankiel',
          description: 'User name',
          maxLength: 100,
        },
        lastName: {
          type: 'string',
          example: 'García Rodríguez',
          description: 'User last name',
          maxLength: 255,
        },
        dni: {
          type: 'string',
          example: '98072248246',
          description: 'User DNI',
          uniqueItems: true,
        },
        role: {
          type: 'string',
          example: 'User',
          description: 'User role',
        },
        token: {
          type: 'string',
          description: 'The JWT Token',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Token Related' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  async signup(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signup(signUpDTO);
  }

  @Post('signin')
  @ApiResponse({
    status: 201,
    description: 'Sign In OK',
    schema: {
      properties: {
        id: {
          type: 'number',
          description: 'The user id',
          example: 4,
          uniqueItems: true,
        },
        email: {
          type: 'string',
          example: 'newuser@gmail.com',
          description: 'User email',
          uniqueItems: true,
        },
        password: {
          type: 'string',
          example: 'mysecretpassword',
          description: 'User password',
        },
        token: {
          type: 'string',
          description: 'The JWT Token',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Token Related' })
  async signin(@Body() signInDTO: SignInDTO) {
    return this.authService.signin(signInDTO);
  }

  @Get('check-status')
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'OK',
    schema: {
      properties: {
        id: {
          type: 'number',
          description: 'The user id',
          example: 4,
          uniqueItems: true,
        },
        email: {
          type: 'string',
          example: 'newuser@gmail.com',
          description: 'User email',
          uniqueItems: true,
        },
        password: {
          type: 'string',
          example: 'mysecretpassword',
          description: 'User password',
        },
        name: {
          type: 'string',
          example: 'Yankiel',
          description: 'User name',
          maxLength: 100,
        },
        lastName: {
          type: 'string',
          example: 'García Rodríguez',
          description: 'User last name',
          maxLength: 255,
        },
        dni: {
          type: 'string',
          example: '98072248246',
          description: 'User DNI',
          uniqueItems: true,
        },
        role: {
          type: 'string',
          example: 'User',
          description: 'User role',
        },
        token: {
          type: 'string',
          description: 'The JWT Token',
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Token Related' })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
