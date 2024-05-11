import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from '../../util/dto/pagination.dto';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { role, ...userDetails } = createUserDto;
      const user = this.userRepository.create({
        ...userDetails,
        role: await this.roleRepository.findOneBy({ id: role }),
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error.code == 23505) {
        throw new BadRequestException(error.detail);
      }
      console.log(error);
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
      const { role, ...userDetails } = updateUserDto;
      const user = await this.userRepository.preload({
        id,
        ...userDetails,
        role:
          (await this.roleRepository.findOneBy({ id: role })) ||
          (await this.findOne(id)).role,
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
}
