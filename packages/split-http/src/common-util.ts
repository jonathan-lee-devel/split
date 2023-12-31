import {Response} from 'express';
import winston from 'winston';

import {HttpStatus} from './enums';

export type HandleUnhandledControllerErrorFunction = (
  sourceControllerName: string,
  err: any,
  res: Response
) => void;

export const makeHandleUnhandledControllerError = (
    logger: winston.Logger,
): HandleUnhandledControllerErrorFunction => (
    sourceControllerName: string,
    err: any,
    res: Response,
) => {
  logger.error(`Unhandled error occurred during execution of controller: ${sourceControllerName}: ${err}`);
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
};
