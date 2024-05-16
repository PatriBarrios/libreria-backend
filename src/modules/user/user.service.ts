import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync } from 'bcryptjs';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { PaginationDto } from '../../util/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, ...userDetails } = createUserDto;
      const userExists = await this.userRepository.findOneBy({ email });

      if (userExists) {
        throw new ConflictException({
          message: 'Email already exists',
        });
      }

      const user = this.userRepository.create({
        ...userDetails,
        email: email,
        password: hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.userRepository.find({
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { ...userDetails } = updateUserDto;

      const user = await this.userRepository.preload({
        id,
        ...userDetails,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return user;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.message === 'Email already exists')
      throw new ConflictException(error.message);

    console.log(error);

    throw new InternalServerErrorException('Check console logs');
  }
}
