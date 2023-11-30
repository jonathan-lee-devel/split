import winston from 'winston';
import crypto from 'crypto';
import logger from '../logger';
import {DEFAULT_ID_LENGTH} from 'split-constants/lib/auth';

export type GenerateIdFunction = (idLength?: number) => Promise<string>;

export const makeGenerateId = (
    logger: winston.Logger,
): GenerateIdFunction => async (idLength): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    idLength = (idLength) ? idLength : DEFAULT_ID_LENGTH;
    crypto.randomBytes(idLength / 2, (err, buffer) => {
      if (err) {
        logger.error(err);
        return reject(err);
      }
      return resolve(buffer.toString('hex'));
    });
  });
};

export const generateId = makeGenerateId(logger);
