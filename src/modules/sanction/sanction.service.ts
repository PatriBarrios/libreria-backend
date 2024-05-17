import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSanctionDto, UpdateSanctionDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sanction } from './entities/sanction.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PaginationDto } from 'src/util/dto/pagination.dto';

@Injectable()
export class SanctionService {
  constructor(
    @InjectRepository(Sanction)
    private readonly sanctionRepository: Repository<Sanction>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createSanctionDto: CreateSanctionDto) {
    try {
      const { user, ...sanctionDetails } = createSanctionDto;
      const userS = await this.userRepository.findOne({
        where: { id: user, isDeleted: false },
      });

      if (!userS) throw new NotFoundException('User not found');

      const sanction = this.sanctionRepository.create({
        ...sanctionDetails,
        user: userS,
      });

      await this.sanctionRepository.save(sanction);
      return sanction;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.sanctionRepository.find({
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
  }

  async findOne(id: number) {
    try {
      const sanction = await this.sanctionRepository.findOneBy({ id });
      if (!sanction) {
        throw new NotFoundException('Sanction not found');
      }
      await this.sanctionRepository.save(sanction);
      return sanction;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async update(id: number, updateSanctionDto: UpdateSanctionDto) {
    try {
      const { user, ...sanctionDetails } = updateSanctionDto;

      let newUser: User;

      if (user)
        newUser = await this.userRepository.findOne({
          where: { id: user, isDeleted: false },
        });

      if (user && !newUser) throw new NotFoundException('User not found');

      const sanction = await this.sanctionRepository.preload({
        id,
        ...sanctionDetails,
        user: newUser || (await this.findOne(id)).user,
      });

      if (!sanction) throw new NotFoundException('Sanction not found');

      await this.sanctionRepository.save(sanction);
      return sanction;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const sanction = await this.findOne(id);
    this.sanctionRepository.remove(sanction);
    return sanction;
  }

  private handleDBErrors(error: any): never {
    if (error.message === 'Sanction not found')
      throw new NotFoundException('Sanction not found');
    if (error.message === 'User not found')
      throw new NotFoundException('User not found');

    console.log(error);
    throw new InternalServerErrorException('Check console logs');
  }
}
