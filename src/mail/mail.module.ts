import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/util/enum/configuration.enum';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get(Configuration.MAIL_HOST),
          secure: false,
          auth: {
            user: config.get(Configuration.MAIL_USER),
            pass: config.get(Configuration.MAIL_PASSWORD),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get(Configuration.MAIL_FROM)}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
