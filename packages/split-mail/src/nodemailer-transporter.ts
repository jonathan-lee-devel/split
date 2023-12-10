import nodemailer, {Transporter} from 'nodemailer';
import {environment} from './environment';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

/**
 * Creates a transporter configuration object for sending emails.
 *
 * @return {Transporter<SMTPTransport.SentMessageInfo>} The transporter configuration object
 */
export const transporterConfig = (): Transporter<SMTPTransport.SentMessageInfo> => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: environment.EMAIL_USER,
    pass: environment.EMAIL_PASSWORD,
  },
});

