import winston from 'winston';
import crypto from 'crypto';
import {DEFAULT_ID_LENGTH} from '@split-common/split-constants';

export type GenerateIdFunction = (idLength?: number) => Promise<string>;

/**
 * Function to generate a random ID of specified length using crypto module.
 *
 * @param {winston.Logger} logger - The logger object to log any errors.
 * @return {GenerateIdFunction} - A function that generates the random ID.
 */
export const makeGenerateId = (
    logger: winston.Logger,
): GenerateIdFunction => async (idLength): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const adjustedIdLength = idLength ?? DEFAULT_ID_LENGTH;
    crypto.randomBytes(adjustedIdLength / 2, (err, buffer) => {
      if (err) {
        logger.error(err);
        return reject(err);
      }
      return resolve(buffer.toString('hex'));
    });
  });
};
