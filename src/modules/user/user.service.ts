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
import { MailService } from '../../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, name, ...userDetails } = createUserDto;
      const userExists = await this.userRepository.findOneBy({ email });

      if (userExists) {
        throw new ConflictException({
          message: 'Email already exists',
        });
      }
      await this.mailService.sendWelcomeEmail(email, name);
      const user = this.userRepository.create({
        ...userDetails,
        email,
        name,
        password: hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;
      delete user.isDeleted;

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const users = await this.userRepository.find({
      where: { isDeleted: false },
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
    users.map((item) => delete item.isDeleted);
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.isDeleted;
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id);
      const { ...userDetails } = updateUserDto;

      const user = await this.userRepository.preload({
        id,
        ...userDetails,
      });

      await this.userRepository.save(user);
      delete user.isDeleted;
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async softDelete(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.update(id, { isDeleted: true });
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
