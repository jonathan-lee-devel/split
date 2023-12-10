import {createLogger, format, Logger} from 'winston';
import ConsoleLoggerTransport from './winston-console-transport';


/**
 * Creates an application logger instance.
 *
 * @param {string} nodeEnv - The current environment mode.
 * @param {string} serviceName - The name of the service.
 * @return {Logger} - The application logger instance.
 */
export const createApplicationLogger = (nodeEnv: string, serviceName: string): Logger =>
  createLogger({
    format: format.combine(
        format.timestamp(),
    ),
    transports: [new ConsoleLoggerTransport()],
    defaultMeta: {service: serviceName},
    level: nodeEnv === 'development' ? 'silly' : 'info',
  });

