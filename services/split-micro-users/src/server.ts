import {
  makeDefaultSafeMongooseConnectionOptions,
  makeOnProcessInterruptSignal,
  SafeMongooseConnection,
} from '@split-common/split-service-config';
import {RabbitMQConnection} from '@split-common/split-service-config/dist/rabbitmq-connection';

import app from './app';
import {environment} from './environment';
import logger from './logger';

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
    serve();
  },
  );
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', makeOnProcessInterruptSignal(logger, {safeMongooseConnection, rabbitMQConnection}));

