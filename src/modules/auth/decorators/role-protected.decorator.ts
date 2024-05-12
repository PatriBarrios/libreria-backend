import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../../util/enum/roletype.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: RoleType[]) => {
  return SetMetadata(META_ROLES, args);
};
