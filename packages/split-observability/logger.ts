import {createLogger, format} from 'winston';
import ConsoleLoggerTransport from './winston-console-transport';


export const createApplicationLogger = (nodeEnv: string, serviceName: string) =>
  createLogger({
    format: format.combine(
        format.timestamp(),
    ),
    transports: [new ConsoleLoggerTransport()],
    defaultMeta: {service: serviceName},
    level: nodeEnv === 'development' ? 'silly' : 'info',
  });

