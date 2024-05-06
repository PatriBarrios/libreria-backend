import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { SignUpDTO } from './dto/signup.dto';
import { Role } from '../role/entities/role.entity';
import { RoleType } from '../../util/enum/roletype.enum';
import { genSalt, hash } from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async signup(signUpDTO: SignUpDTO) {
    const { email, password, name, lastName, dni } = signUpDTO;
    const user = new User();
    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.dni = dni;

    const roleRepository = await this.dataSource.getRepository(Role);
    const defaultRole = await roleRepository.findOne({
      where: { name: RoleType.USER },
    });

    user.role = defaultRole;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
