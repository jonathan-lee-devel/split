import {ConsumeMessage} from 'amqplib';

export type VALID_QUEUE_NAME = 'mail-to-send';

export type MessageQueueConsumer = (message: ConsumeMessage | null) => Promise<void>;

export interface MailToSendMessage {
  toEmail: string;
  subject: string;
  html: string;
}
