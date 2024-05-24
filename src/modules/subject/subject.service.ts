import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subject } from './entities/subject.entity';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectRepository.create(createSubjectDto);
    await this.subjectRepository.save(subject);
    delete subject.isDeleted;
    return subject;
  }

  async findAll() {
    const subjects = await this.subjectRepository.find({
      where: { isDeleted: false },
    });
    subjects.map((item) => delete item.isDeleted);
    return subjects;
  }

  async findOne(id: number) {
    const subject = await this.subjectRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    delete subject.isDeleted;
    return subject;
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(id);
    const subject = await this.subjectRepository.preload({
      id,
      ...updateSubjectDto,
    });

    await this.subjectRepository.save(subject);
    delete subject.isDeleted;
    return subject;
  }

  async softDelete(id: number) {
    const subject = await this.findOne(id);
    this.subjectRepository.update(id, { isDeleted: true });
    return subject;
  }
}
