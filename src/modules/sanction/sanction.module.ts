import { Module } from '@nestjs/common';
import { SanctionService } from './sanction.service';
import { SanctionController } from './sanction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sanction } from './entities/sanction.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sanction, User]), AuthModule],
  controllers: [SanctionController],
  providers: [SanctionService],
})
export class SanctionModule {}
