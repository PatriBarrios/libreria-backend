import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subject } from './entities/subject.entity';
import { PaginationDto } from '../../util/dto/pagination.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectRepository.create(createSubjectDto);
    return this.subjectRepository.save(subject);
  }

  async findAll(paginationDto: PaginationDto) {
    return await this.subjectRepository.find({
      take: paginationDto.limit || 10,
      skip: paginationDto.offset || 0,
    });
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findOneBy({ id: id });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.preload({
      id,
      ...updateSubjectDto,
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    await this.subjectRepository.save(subject);
    return subject;
  }

  async remove(id: number) {
    const subject = await this.findOne(id);
    this.subjectRepository.remove(subject);
    return subject;
  }
}
