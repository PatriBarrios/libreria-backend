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
import { BookCopyService } from './book_copy.service';
import { CreateBookCopyDto } from './dto/create-book_copy.dto';
import { UpdateBookCopyDto } from './dto/update-book_copy.dto';
import { PaginationDto } from 'src/util/dto/pagination.dto';

@Controller('book-copy')
export class BookCopyController {
  constructor(private readonly bookCopyService: BookCopyService) {}

  @Post()
  create(@Body() createBookCopyDto: CreateBookCopyDto) {
    return this.bookCopyService.create(createBookCopyDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.bookCopyService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookCopyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookCopyDto: UpdateBookCopyDto,
  ) {
    return this.bookCopyService.update(id, updateBookCopyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookCopyService.remove(id);
  }
}
