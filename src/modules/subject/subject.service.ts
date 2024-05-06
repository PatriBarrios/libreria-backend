import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateRoleDto } from '../role/dto/update-role.dto';

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

  async findAll() {
    return await this.subjectRepository.find();
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findOneBy({ id: id });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const subject = await this.subjectRepository.update(id, updateRoleDto);

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return 'Updated';
  }

  async remove(id: number) {
    const subject = await this.subjectRepository.findOneBy({ id: id });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    this.subjectRepository.remove(subject);
    return subject;
  }
}
