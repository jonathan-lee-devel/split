import {RabbitMQConnection} from '@split-common/split-service-config/dist/rabbitmq-connection';
import winston from 'winston';

export const makeRabbitMQConnection = async (logger: winston.Logger, connectionUrl: string) => {
  const rabbitMQConnection = new RabbitMQConnection(logger, connectionUrl);
  await rabbitMQConnection.connectQueue();
  return rabbitMQConnection;
};
