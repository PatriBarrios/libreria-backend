import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDTO } from './dto/signin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dto/signup.dto';
import { User } from '../user/entities/user.entity';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signUpDTO: SignUpDTO) {
    const { email } = signUpDTO;
    const userExists = await this.authRepository.findOne({
      where: { email: email },
    });

    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    return this.authRepository.signup(signUpDTO);
  }

  async signin(signInDTO: SignInDTO) {
    const { email, password } = signInDTO;
    const user: User = await this.authRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password is wrong');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      dni: user.dni,
      role: user.role,
    };

    const token = await this.jwtService.sign(payload);

    return { token };
  }
}
