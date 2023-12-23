import {GenerateIdFunction} from '@split-common/split-auth';
import {Model} from 'mongoose';
import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import winston from 'winston';

import {EmailSendAttempt} from './models';

export type SendMailFunction = (
  addressTo: string,
  subject: string,
  html: string,
) => Promise<void>;

/**
 * Send an email using the specified environment, logger, EmailSendAttempt model,
 * generateId function, and transporter.
 *
 * @param {winston.Logger} logger - The logger instance.
 * @param {string} nodeEnv - Environment in which the sending service is running
 * @param {string} emailUser - The e-mail the e-mails are coming from
 * @param {Model<EmailSendAttempt>} EmailSendAttempt - The Mongoose model for EmailSendAttempt documents.
 * @param {GenerateIdFunction} generateId - The function to generate a unique ID.
 * @param {Transporter<SMTPTransport.SentMessageInfo>} transporter - The email transporter.
 * @return {SendMailFunction} - The function to send the email.
 */
export const makeSendMail = (
    logger: winston.Logger,
    nodeEnv: string,
    emailUser: string,
    EmailSendAttempt: Model<EmailSendAttempt>,
    generateId: GenerateIdFunction,
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
): SendMailFunction => async (
    to: string,
    subject: string,
    html: string,
): Promise<void> => {
  const from = `${nodeEnv === 'staging' ? 'Split.Direct (Staging)' : 'Split.Direct'} <${emailUser}>`;
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
