import {NextFunction, Request, Response} from 'express';
import winston from 'winston';

// eslint-disable-next-line valid-jsdoc
/**
 * Logs the response time for each request and sends it to the specified logger.
 *
 * @param {winston.Logger} logger - The logger instance to send the log to.
 * @param {string} serviceName - The name of the service.
 * @return Returns the middleware function.
 */
export const makeLogResponseTime = (
    logger: winston.Logger,
    serviceName: string,
) => (req: Request, res: Response, next: NextFunction) => {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    const message = `${req.method} ${res.statusCode} ${elapsedTimeInMs}ms\t${req.path}`;
    logger.log({level: 'debug', message, consoleLoggerOptions: {label: serviceName}});
  });

  next();
};
