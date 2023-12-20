import {
  makeDefaultSafeMongooseConnectionOptions,
  makeOnProcessInterruptSignal,
  RabbitMQConnection,
  SafeMongooseConnection,
} from '@split-common/split-service-config';

import app from './app';
import {environment} from './environment';
import logger from './logger';

import {consumeSendMailMessage} from './index';

const PORT = environment.PORT;

const safeMongooseConnection = new SafeMongooseConnection(
    makeDefaultSafeMongooseConnectionOptions(
        logger,
        environment.NODE_ENV,
        environment.DATABASE_URL,
        'USERS',
    ),
);

export const rabbitMQConnection = new RabbitMQConnection(
    logger,
    environment.RABBITMQ_URL,
);

const serve = () => app.listen(PORT, () => {
  logger.info(`🌏 Express server started at http://localhost:${PORT}`);
});

safeMongooseConnection.connect((mongoUrl) => {
  logger.info(`Connected to MongoDB at ${mongoUrl}`);
  rabbitMQConnection.connectQueue().then(() => {
    serve();
    logger.info(`Connected to RabbitMQ at ${environment.RABBITMQ_URL}`);
    rabbitMQConnection.startConsumingData('mail-to-send', consumeSendMailMessage)
        .then(() => {
          logger.info(`Starting to process data from RabbitMQ queue`);
        }).catch(async (err) => {
          logger.error(`Error occurred while consuming RabbitMQ data: ${err}`);
          await safeMongooseConnection.close(true);
          process.exit(1);
        });
  },
  );
});

// Close the Mongoose and RabbitMQ connection, when receiving SIGINT
process.on('SIGINT', makeOnProcessInterruptSignal(logger, {safeMongooseConnection, rabbitMQConnection}));

