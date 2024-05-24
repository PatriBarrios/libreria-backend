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
import { MailService } from '../../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, name, dni, ...userDetails } = createUserDto;
      const userExists = await this.userRepository.findOneBy({ email });

      if (userExists) {
        throw new ConflictException({
          message: 'Email already exists',
        });
      }

      if (!this.validDni(dni)) throw new BadRequestException('Invalid dni');

      await this.mailService.sendWelcomeEmail(email, name);
      const user = this.userRepository.create({
        ...userDetails,
        email,
        name,
        dni,
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

  async findAll() {
    const users = await this.userRepository.find({
      where: { isDeleted: false },
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

  private validDni(dni: string): boolean {
    // eslint-disable-next-line prettier/prettier
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const months28 = ['02'];
    const months30 = ['04', '06', '09', '11'];
    const months31 = ['01', '03', '05', '07', '08', '10', '12'];
    // eslint-disable-next-line prettier/prettier
    const days28 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];
    // eslint-disable-next-line prettier/prettier
    const days30 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
    // eslint-disable-next-line prettier/prettier
    const days31 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

    const month = dni.slice(2, 4);
    const day = dni.slice(4, 6);

    if (!months.includes(month)) return false;

    if (months28.includes(month) && !days28.includes(day)) return false;

    if (months30.includes(month) && !days30.includes(day)) return false;

    if (months31.includes(month) && !days31.includes(day)) return false;

    return true;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.message === 'Email already exists')
      throw new ConflictException(error.message);
    if (error.message === 'Invalid dni')
      throw new BadRequestException(error.message);

    console.log(error);

    throw new InternalServerErrorException('Check console logs');
  }
}
