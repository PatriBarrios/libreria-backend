import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

import { CreateAuthorDto } from './create-author.dto';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
  @IsString()
  name: string;

  @IsString()
  lastName: string;
}
