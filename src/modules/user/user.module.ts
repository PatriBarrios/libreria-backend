import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
