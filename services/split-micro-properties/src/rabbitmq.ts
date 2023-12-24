import {RabbitMQConnection} from '@split-common/split-service-config';
import winston from 'winston';

export const makeMailToSendRabbitMQConnection = async <TMessage>(logger: winston.Logger, connectionUrl: string) => {
  const rabbitMQConnection = new RabbitMQConnection<TMessage>(logger, connectionUrl);
  await rabbitMQConnection.connectQueue();
  return rabbitMQConnection;
};
