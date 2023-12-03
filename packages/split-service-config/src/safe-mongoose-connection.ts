import mongoose, {ConnectOptions} from 'mongoose';
import winston from 'winston';
import util from 'util';

/** Callback for establishing or re-establishing mongo connection */
export type IOnConnectedCallback = (mongoUrl: string) => void;

export interface SafeMongooseConnectionOptions {
  mongoUrl: string;
  mongooseConnectionOptions?: ConnectOptions;
  retryDelayMs?: number;
  debugCallback?: (
    collectionName: string,
    method: string,
    query: any,
    doc: string
  ) => void;
  onStartConnection?: (mongoUrl: string) => void;
  onConnectionError?: (error: Error, mongoUrl: string) => void;
  onConnectionRetry?: (mongoUrl: string) => void;
}

const defaultMongooseConnectionOptions: ConnectOptions = {
  autoCreate: true,
  autoIndex: true,
};

/**
 * A Mongoose Connection wrapper class to
 * help with mongo connection issues.
 *
 * This library tries to auto-reconnect to
 * MongoDB without crashing the server.
 * @author Sidhant Panda
 */
export class SafeMongooseConnection {
  /** Safe Mongoose Connection options */
  private readonly options: SafeMongooseConnectionOptions;

  /** Callback when mongo connection is established or re-established */
  private onConnectedCallback?: IOnConnectedCallback;

  /**
   * Internal flag to check if connection established for
   * first time or after a disconnection
   */
  private isConnectedBefore: boolean = false;

  private shouldCloseConnection: boolean = false;

  /** Delay between retrying connecting to Mongo */
  private retryDelayMs: number = 2000;

  /** Mongo connection options to be passed Mongoose */
  private readonly mongoConnectionOptions: ConnectOptions = defaultMongooseConnectionOptions;

  private connectionTimeout?: NodeJS.Timeout;

  constructor(options: SafeMongooseConnectionOptions) {
    this.options = options;
    mongoose.connection.on('error', this.onError);
    mongoose.connection.on('connected', this.onConnected);
    mongoose.connection.on('disconnected', this.onDisconnected);
    mongoose.connection.on('reconnected', this.onReconnected);

    if (options.debugCallback) {
      mongoose.set('debug', options.debugCallback);
    }
    if (options.retryDelayMs) {
      this.retryDelayMs = options.retryDelayMs;
    }
  }

  public async close(force: boolean = false) {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
    this.shouldCloseConnection = true;
    await mongoose.connection.close(force);
  }

  public connect(onConnectedCallback: IOnConnectedCallback) {
    this.onConnectedCallback = onConnectedCallback;
    this.startConnection();
  }

  private startConnection = () => {
    if (this.options.onStartConnection) {
      this.options.onStartConnection(this.options.mongoUrl);
    }
    mongoose.connect(this.options.mongoUrl, this.mongoConnectionOptions).catch(() => { });
  };

  /**
   * Handler called when mongo connection is established
   */
  private onConnected = () => {
    this.isConnectedBefore = true;
    this.onConnectedCallback?.(this.options.mongoUrl);
  };

  /** Handler called when mongo gets re-connected to the database */
  private onReconnected = () => {
    this.onConnectedCallback?.(this.options.mongoUrl);
  };

  /** Handler called for mongo connection errors */
  private onError = () => {
    if (this.options.onConnectionError) {
      const error = new Error(`Could not connect to MongoDB at ${this.options.mongoUrl}`);
      this.options.onConnectionError(error, this.options.mongoUrl);
    }
  };

  /** Handler called when mongo connection is lost */
  private onDisconnected = () => {
    if (!this.isConnectedBefore && !this.shouldCloseConnection) {
      this.connectionTimeout = setTimeout(() => {
        this.startConnection();
        // eslint-disable-next-line no-unused-expressions
        this.connectionTimeout && clearTimeout(this.connectionTimeout);
      }, this.retryDelayMs);
      if (this.options.onConnectionRetry) {
        this.options.onConnectionRetry(this.options.mongoUrl);
      }
    }
  };
}

export const makeDefaultSafeMongooseConnectionOptions = (
    logger: winston.Logger,
    nodeEnv: string,
    mongoUrl: string,
    label: string,
): SafeMongooseConnectionOptions => {
  let debugCallback;
  if (nodeEnv === 'development') {
    debugCallback = (collectionName: string, method: string, query: any, doc: string): void => {
      const message = `${collectionName}.${method}(${util.inspect(query, {colors: true, depth: null})})`;
      logger.log({level: 'verbose', message, consoleLoggerOptions: {label}});
    };
  }
  return {
    mongoUrl,
    debugCallback,
    onStartConnection: (mongoUrl) => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
    onConnectionError: (error, mongoUrl) => logger.log({
      level: 'error',
      message: `Could not connect to MongoDB at ${mongoUrl}`,
      error,
    }),
    onConnectionRetry: (mongoUrl) => logger.info(`Retrying to MongoDB at ${mongoUrl}`),
  };
};

export const makeOnProcessInterruptSignal = (logger: winston.Logger, safeMongooseConnection: SafeMongooseConnection) => async () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  logger.info('Closing the MongoDB connection');
  try {
    await safeMongooseConnection.close(true);
    logger.info('Mongo connection closed successfully');
  } catch (err) {
    logger.log({
      level: 'error',
      message: 'Error shutting closing mongo connection',
      error: err,
    });
  }
  process.exit(0);
};
