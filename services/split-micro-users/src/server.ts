import {
  makeDefaultSafeMongooseConnectionOptions,
  makeOnProcessInterruptSignal,
  SafeMongooseConnection,
} from '@split-common/split-service-config';
import app from './app';
import logger from './logger';
import {environment} from './environment';

const PORT = environment.PORT;

const safeMongooseConnection = new SafeMongooseConnection(
    makeDefaultSafeMongooseConnectionOptions(environment, logger),
);

const serve = () => app.listen(PORT, () => {
  logger.info(`🌏 Express server started at http://localhost:${PORT}`);
});

safeMongooseConnection.connect((mongoUrl) => {
  logger.info(`Connected to MongoDB at ${mongoUrl}`);
  serve();
});

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', makeOnProcessInterruptSignal(logger, safeMongooseConnection));

