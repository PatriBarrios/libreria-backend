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

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationDto } from '../../util/dto/pagination.dto';
import { RoleType } from 'src/util/enum/roletype.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Auth(RoleType.ADMIN)
  @ApiCreatedResponse({
    description: 'User created',
    schema: {
      properties: {
        id: {
          type: 'number',
          description: 'The user id',
          example: 4,
          uniqueItems: true,
        },
        email: {
          type: 'string',
          example: 'newuser@gmail.com',
          description: 'User email',
          uniqueItems: true,
        },
        name: {
          type: 'string',
          example: 'Yankiel',
          description: 'User name',
          maxLength: 100,
        },
        lastName: {
          type: 'string',
          example: 'García Rodríguez',
          description: 'User last name',
          maxLength: 255,
        },
        dni: {
          type: 'string',
          example: '98072248246',
          description: 'User DNI',
          uniqueItems: true,
        },
        role: {
          type: 'string',
          example: 'User',
          description: 'User role',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiOkResponse({
    description: 'OK',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: {
            type: 'number',
            description: 'The user id',
            example: 4,
            uniqueItems: true,
          },
          email: {
            type: 'string',
            example: 'user@gmail.com',
            description: 'User email',
            uniqueItems: true,
          },
          name: {
            type: 'string',
            example: 'Yankiel',
            description: 'User name',
            maxLength: 100,
          },
          lastName: {
            type: 'string',
            example: 'García Rodríguez',
            description: 'User last name',
            maxLength: 255,
          },
          dni: {
            type: 'string',
            example: '98072248246',
            description: 'User DNI',
            uniqueItems: true,
          },
          role: {
            type: 'string',
            example: 'User',
            description: 'User role',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(RoleType.ADMIN, RoleType.LIBRARIAN)
  @ApiOkResponse({
    description: 'OK',
    schema: {
      properties: {
        id: {
          type: 'number',
          description: 'The user id',
          example: 4,
          uniqueItems: true,
        },
        email: {
          type: 'string',
          example: 'user@gmail.com',
          description: 'User email',
          uniqueItems: true,
        },
        name: {
          type: 'string',
          example: 'Yankiel',
          description: 'User name',
          maxLength: 100,
        },
        lastName: {
          type: 'string',
          example: 'García Rodríguez',
          description: 'User last name',
          maxLength: 255,
        },
        dni: {
          type: 'string',
          example: '98072248246',
          description: 'User DNI',
          uniqueItems: true,
        },
        role: {
          type: 'string',
          example: 'User',
          description: 'User role',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  @ApiOkResponse({ description: 'Author updated', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth()
  @ApiOkResponse({
    description: 'Author deleted',
    schema: {
      properties: {
        id: {
          type: 'number',
          description: 'The user id',
          example: 4,
          uniqueItems: true,
        },
        email: {
          type: 'string',
          example: 'user@gmail.com',
          description: 'User email',
          uniqueItems: true,
        },
        name: {
          type: 'string',
          example: 'Yankiel',
          description: 'User name',
          maxLength: 100,
        },
        lastName: {
          type: 'string',
          example: 'García Rodríguez',
          description: 'User last name',
          maxLength: 255,
        },
        dni: {
          type: 'string',
          example: '98072248246',
          description: 'User DNI',
          uniqueItems: true,
        },
        role: {
          type: 'string',
          example: 'User',
          description: 'User role',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Token Related' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.softDelete(id);
  }
}
