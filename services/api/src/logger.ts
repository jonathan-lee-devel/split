import {createLogger, format} from 'winston';
import ConsoleLoggerTransport from './lib/winston-console-transport';
import {environment} from './environment';

const logger = createLogger({
  format: format.combine(format.timestamp()),
  transports: [new ConsoleLoggerTransport()],
  defaultMeta: {service: 'api'},
  level: environment.NODE_ENV === 'development' ? 'silly' : 'info',
});

export default logger;
