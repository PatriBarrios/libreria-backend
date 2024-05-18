import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Library',
        template: './welcome.hbs',
        context: {
          name,
          libraryName: 'Web Library',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
