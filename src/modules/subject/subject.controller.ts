import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { SubjectService } from './subject.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';
import { PaginationDto } from 'src/util/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleType } from 'src/util/enum/roletype.enum';
import { Subject } from './entities/subject.entity';

@ApiBearerAuth()
@ApiTags('Subject')
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiCreatedResponse({
    description: 'Subject created',
    type: Subject,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto);
  }

  @Get()
  @ApiOkResponse({ description: 'OK', type: [Subject] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.subjectService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK', type: Subject })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.findOne(id);
  }

  @Patch(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiOkResponse({ description: 'Subject updated', type: Subject })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiOkResponse({ description: 'Subject deleted', type: Subject })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.softDelete(id);
  }
}
