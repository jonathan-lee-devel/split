import {MailToSendMessage, MessageQueueConsumer} from '@split-common/split-constants';
import {SendMailFunction} from '@split-common/split-mail';
import {RabbitMQConnection} from '@split-common/split-service-config';
import {ConsumeMessage} from 'amqplib';
import winston from 'winston';

export const makeConsumeSendMailMessage = (
    logger: winston.Logger,
    sendMail: SendMailFunction,
    rabbitMQConnection: RabbitMQConnection<MailToSendMessage>,
): MessageQueueConsumer => (message: ConsumeMessage | null) => {
  if (!message) {
    return;
  }
  const data: MailToSendMessage = JSON.parse(message.content.toString('utf-8'));
  logger.info(`Consumed data from mail-to-send-queue with email: ${data.toEmail}`);
  try {
    rabbitMQConnection.getChannel()?.ack(message);
  } catch (err) {
    logger.error(`Error while ack-ing message for channel: ${rabbitMQConnection.getChannel()}`);
  }
  sendMail(data.toEmail, data.subject, data.html)
      .catch((err) => {
        logger.error(`Error occurred while sending mail: ${err}`);
      });
};
