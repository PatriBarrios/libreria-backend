import { Role } from '../role/entities/role.entity';

export interface IJwtPayload {
  id: number;
  email: string;
  name: string;
  lastName: string;
  dni: string;
  role: Role;
  iat?: Date;
}
