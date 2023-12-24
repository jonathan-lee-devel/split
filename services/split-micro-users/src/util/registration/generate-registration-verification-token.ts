import {randomBytes} from 'crypto';

import {RegistrationVerificationToken} from '@split-common/split-auth';
import {DEFAULT_TOKEN_BUFFER_ENCODING, DEFAULT_TOKEN_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {addMinutes} from 'date-fns/addMinutes';
import {Model} from 'mongoose';
import winston from 'winston';


export type GenerateRegistrationVerificationTokenFunction = (
  userEmail: string,
  tokenSize?: number | undefined,
  expiryTimeMinutes?: number | undefined,
) => Promise<RegistrationVerificationToken>;

export const makeGenerateRegistrationVerificationToken = (
    logger: winston.Logger,
    RegistrationVerificationToken: Model<RegistrationVerificationToken>,
): GenerateRegistrationVerificationTokenFunction => async (
    userEmail,
    tokenSize,
    expiryTimeMinutes,
) => {
  tokenSize = tokenSize ?? DEFAULT_TOKEN_SIZE;
  expiryTimeMinutes = expiryTimeMinutes ?? DEFAULT_TOKEN_EXPIRY_TIME_MINUTES;
  const registrationVerificationToken = await RegistrationVerificationToken.create({
    value: randomBytes(tokenSize / 2).toString(DEFAULT_TOKEN_BUFFER_ENCODING),
    expiryDate: addMinutes(new Date(), expiryTimeMinutes),
    userEmail,
  });

  logger.info(`Generated registration verification token for user with e-mail: <${userEmail}>`);
  return registrationVerificationToken;
};
