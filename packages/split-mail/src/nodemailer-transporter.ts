import nodemailer, {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

/**
 * Creates a transporter configuration object for sending emails.
 *
 * @param {string} emailUser - User to log into G-Mail with
 * @param {string} emailPassword - Password to authenticate with
 * @return {Transporter<SMTPTransport.SentMessageInfo>} The transporter configuration object
 */
export const transporterConfig = (emailUser: string, emailPassword: string)
  : Transporter<SMTPTransport.SentMessageInfo> => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

