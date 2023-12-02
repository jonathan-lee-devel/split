import winston from 'winston';
import {Model} from 'mongoose';
import {randomBytes} from 'crypto';
import addMinutes from 'date-fns/addMinutes';
import {DEFAULT_TOKEN_BUFFER_ENCODING, DEFAULT_TOKEN_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split/split-constants';
import {RegistrationVerificationToken} from '@split/split-auth';


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
  if (!tokenSize) {
    tokenSize = DEFAULT_TOKEN_SIZE;
  }
  if (!expiryTimeMinutes) {
    expiryTimeMinutes = DEFAULT_TOKEN_EXPIRY_TIME_MINUTES;
  }
  const registrationVerificationToken: RegistrationVerificationToken = {
    value: randomBytes(tokenSize / 2).toString(DEFAULT_TOKEN_BUFFER_ENCODING),
    expiryDate: addMinutes(new Date(), expiryTimeMinutes),
    userEmail,
  };
  await RegistrationVerificationToken.create(registrationVerificationToken);

  logger.info(`Generated registration verification token for user with e-mail: <${userEmail}>`);
  return registrationVerificationToken;
};
