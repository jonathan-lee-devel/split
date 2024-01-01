import {MailToSendMessage} from '@split-common/split-constants';
import {RabbitMQConnection} from '@split-common/split-service-config/dist/rabbitmq-connection';
import winston from 'winston';

export const makeMailToSendRabbitMQConnection = async (logger: winston.Logger, connectionUrl: string) => {
  const rabbitMQConnection = new RabbitMQConnection<MailToSendMessage>(logger, connectionUrl);
  await rabbitMQConnection.connectQueue();
  return rabbitMQConnection;
};
