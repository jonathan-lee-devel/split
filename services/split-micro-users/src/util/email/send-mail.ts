import winston from 'winston';
import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {Model} from 'mongoose';
import {EmailSendAttempt} from '@split/split-auth-config';
import {Environment} from '../../environment';
import {GenerateIdFunction} from '../../lib/generate-id';

export type SendMailFunction = (
  addressTo: string,
  subject: string,
  html: string,
) => Promise<void>;

export const makeSendMail = (
    environment: Environment,
    logger: winston.Logger,
    EmailSendAttempt: Model<EmailSendAttempt>,
    generateId: GenerateIdFunction,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
): SendMailFunction => async (
    to: string,
    subject: string,
    html: string,
): Promise<void> => {
  const from = `Split.Direct <${environment.EMAIL_USER}>`;
  const emailSendAttempt: EmailSendAttempt = {
    id: await generateId(),
    from,
    to,
    subject,
    html,
    isSentSuccessfully: false,
  };
  const emailSendAttemptModel = await EmailSendAttempt.create(emailSendAttempt);
  logger.info(`Attempting to send e-mail to: <${to}> with attempt ID: ${emailSendAttempt.id}`);
  let response: SMTPTransport.SentMessageInfo | null = null;
  try {
    response = await transporter.sendMail(
        {
          from,
          to,
          subject,
          html,
        },
    );
  } catch (err) {
    logger.error(`Error occurred while sending mail attempt ID: ${emailSendAttempt.id} : ${err}`);
  }
  if (!response) {
    logger.error(`Failed to send e-mail to: <${to}> (response: null) with attempt ID: ${emailSendAttempt.id}`);
    return;
  }
  if (response.accepted.includes(to)) {
    logger.info(`Successfully sent e-mail to: <${to}> with attempt ID: ${emailSendAttempt.id}`);
    emailSendAttemptModel.isSentSuccessfully = true;
    await emailSendAttemptModel.save();
    return;
  }
  logger.error(`Unable to send e-mail to: <${to}> with attempt ID: ${emailSendAttempt.id}`);
};
