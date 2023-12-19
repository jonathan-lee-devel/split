import {
  makeDefaultSafeMongooseConnectionOptions,
  makeOnProcessInterruptSignal,
  RabbitMQConnection,
  SafeMongooseConnection,
} from '@split-common/split-service-config';

import app from './app';
import {environment} from './environment';
import logger from './logger';
import {sendMail} from './mail';

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
    logger.info(`Connected to RabbitMQ at ${environment.RABBITMQ_URL}`);
    rabbitMQConnection.startConsumingData('mail-to-send', async (message) => {
      if (!message) {
        return;
      }
      const data = JSON.parse(message.content.toString('utf-8'));
      logger.info(`Consumed data.email: ${data.email}`);
      await sendMail(data.email, 'Split Test', '<h1>Hello from RabbitMQ</h1>');
      await rabbitMQConnection.getChannel()?.ack(message);
    }).then(() => {
      logger.info(`Starting to process data from RabbitMQ queue`);
    }).catch((err) => {
      logger.error(`Error occurred while consuming RabbitMQ data: ${err}`);
    });
    serve();
  },
  );
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', makeOnProcessInterruptSignal(logger, {safeMongooseConnection, rabbitMQConnection}));

