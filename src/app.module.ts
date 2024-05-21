import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SubjectModule } from './modules/subject/subject.module';
import { AuthorModule } from './modules/author/author.module';
import { UserModule } from './modules/user/user.module';
import { BookModule } from './modules/book/book.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookCopyModule } from './modules/book_copy/book_copy.module';
import { LoanModule } from './modules/loan/loan.module';
import { SanctionModule } from './modules/sanction/sanction.module';
import { MailModule } from './mail/mail.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SubjectModule,
    AuthorModule,
    UserModule,
    BookModule,
    AuthModule,
    BookCopyModule,
    LoanModule,
    SanctionModule,
    MailModule,
    ReportsModule,
  ],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get('PORT');
  }
}
