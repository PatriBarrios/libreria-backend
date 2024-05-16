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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PaginationDto } from '../../util/dto/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleType } from 'src/util/enum/roletype.enum';
import { Author } from './entities/author.entity';

@ApiBearerAuth()
@ApiTags('Author')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiResponse({ status: 201, description: 'Author created', type: Author })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Token Related' })
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'OK', type: [Author] })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authorService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'OK', type: Author })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiResponse({ status: 200, description: 'Author updated', type: Author })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Token Related' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiResponse({ status: 200, description: 'Author deleted', type: Author })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Token Related' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.remove(id);
  }
}
