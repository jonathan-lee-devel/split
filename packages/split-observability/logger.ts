import {createLogger, format, Logger, transports} from 'winston';

import ConsoleLoggerTransport from './winston-console-transport';

// const {combine, timestamp, json, errors} = format;
// const errorsFormat = errors({stack: true});


/**
 * Creates an application logger instance.
 *
 * @param {string} nodeEnv - The current environment mode.
 * @param {string} serviceName - The name of the service.
 * @param {string} apiKey - Datadog API key if Datadog logging is enabled (Staging and Production)
 * @return {Logger} - The application logger instance.
 */
export const createApplicationLogger = (nodeEnv: string, serviceName: string, apiKey?: string): Logger =>
  createLogger({
    transports: (nodeEnv) === 'development' ?
      [new ConsoleLoggerTransport()] :
      [
        new ConsoleLoggerTransport(),
        new transports.Http({
          host: 'http-intake.logs.datadoghq.eu',
          path: `/api/v2/logs?dd-api-key=${apiKey}&ddsource=nodejs&service=${serviceName}&hostname=${(nodeEnv === 'staging') ? 'staging.split.direct' : 'split.direct'}`,
          ssl: true,
        }),
      ],
    format: format.json(),
    defaultMeta: {service: serviceName},
    level: nodeEnv === 'development' ? 'silly' : 'info',
    exitOnError: false,
  });

