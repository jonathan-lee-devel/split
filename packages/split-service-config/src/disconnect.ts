import winston from 'winston';

import {RabbitMQConnection} from './rabbitmq-connection';
import {SafeMongooseConnection} from './safe-mongoose-connection';

export interface ConnectionContainer {
  safeMongooseConnection: SafeMongooseConnection | undefined;
  rabbitMQConnection: RabbitMQConnection | undefined;
}

export const makeOnProcessInterruptSignal = (logger: winston.Logger, connectionContainer: ConnectionContainer) => async () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  if (connectionContainer.safeMongooseConnection) {
    logger.info('Closing the MongoDB connection');
    try {
      await connectionContainer.safeMongooseConnection.close(true);
      logger.info('Mongo connection closed successfully');
    } catch (err) {
      logger.error(`Error closing the Mongo connection: ${err}`);
    }
  }
  if (connectionContainer.rabbitMQConnection) {
    logger.info(`Closing the RabbitMQ connection`);
    try {
      await connectionContainer.rabbitMQConnection.disconnectQueue();
      logger.info(`RabbitMQ connection closed successfully`);
    } catch (err) {
      logger.error(`Error closing the RabbitMQ connection: ${err}`);
    }
  }
  process.exit(0);
};
