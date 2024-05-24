import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
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

import { SanctionService } from './sanction.service';
import { CreateSanctionDto, UpdateSanctionDto } from './dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleType } from 'src/util/enum/roletype.enum';
import { Sanction } from './entities/sanction.entity';

@ApiBearerAuth()
@ApiTags('Sanction')
@Controller('sanction')
export class SanctionController {
  constructor(private readonly sanctionService: SanctionService) {}

  @Post()
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiCreatedResponse({ description: 'Sanction created', type: Sanction })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  create(@Body() createSanctionDto: CreateSanctionDto) {
    return this.sanctionService.create(createSanctionDto);
  }

  @Get()
  @Auth()
  @ApiOkResponse({ description: 'OK', type: [Sanction] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  findAll() {
    return this.sanctionService.findAll();
  }

  @Get(':id')
  @Auth()
  @ApiOkResponse({ description: 'OK', type: Sanction })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sanctionService.findOne(id);
  }

  @Patch(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiOkResponse({ description: 'Sanction updated', type: Sanction })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSanctionDto: UpdateSanctionDto,
  ) {
    return this.sanctionService.update(id, updateSanctionDto);
  }

  @Delete(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiOkResponse({ description: 'Sanction deleted', type: Sanction })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sanctionService.remove(id);
  }
}
