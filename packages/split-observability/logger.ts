import {createLogger, format} from 'winston';
import ConsoleLoggerTransport from './winston-console-transport';
import {environment} from './environment';

export const createApplicationLogger = (serviceName: string) =>
  createLogger({
    format: format.combine(format.timestamp()),
    transports: [new ConsoleLoggerTransport()],
    defaultMeta: {service: serviceName},
    level: environment.NODE_ENV === 'development' ? 'silly' : 'info',
  });

