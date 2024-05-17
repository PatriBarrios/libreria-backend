import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Library',
        text: `Hola ${name}`,
        html: `
        <h3>A dormir tanke que ya esta talla pincha :)</h3>
      `,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
