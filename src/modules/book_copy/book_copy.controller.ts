import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Patch,
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

import { BookCopyService } from './book_copy.service';
import { CreateBookCopyDto, UpdateBookCopyDto } from './dto';
import { PaginationDto } from 'src/util/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleType } from '../../util/enum/roletype.enum';
import { BookCopy } from './entities/book_copy.entity';

@ApiBearerAuth()
@ApiTags('Book Copy')
@Controller('book-copy')
export class BookCopyController {
  constructor(private readonly bookCopyService: BookCopyService) {}

  @Post()
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiCreatedResponse({ description: 'Author created', type: BookCopy })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  create(@Body() createBookCopyDto: CreateBookCopyDto) {
    return this.bookCopyService.create(createBookCopyDto);
  }

  @Get()
  @ApiOkResponse({ description: 'OK', type: [BookCopy] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.bookCopyService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK', type: BookCopy })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookCopyService.findOne(id);
  }

  @Patch(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiOkResponse({ description: 'Book copy updated', type: BookCopy })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookCopyDto: UpdateBookCopyDto,
  ) {
    return this.bookCopyService.update(id, updateBookCopyDto);
  }

  @Delete(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiOkResponse({ description: 'Book copy deleted', type: BookCopy })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookCopyService.softDelete(id);
  }
}
