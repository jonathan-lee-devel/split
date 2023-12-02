import winston from 'winston';
import {Model} from 'mongoose';
import {randomBytes} from 'crypto';
import addMinutes from 'date-fns/addMinutes';
import {DEFAULT_TOKEN_BUFFER_ENCODING, DEFAULT_TOKEN_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split/split-constants';
import {PasswordResetVerificationToken} from '@split/split-auth';

export type GeneratePasswordResetVerificationTokenFunction = (
  userEmail: string,
  tokenSize?: number | undefined,
  expiryTimeMinutes?: number | undefined,
) => Promise<PasswordResetVerificationToken>;

export const makeGeneratePasswordResetVerificationToken = (
    logger: winston.Logger,
    PasswordResetVerificationToken: Model<PasswordResetVerificationToken>,
): GeneratePasswordResetVerificationTokenFunction => async (
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
  const passwordResetVerificationToken: PasswordResetVerificationToken = {
    value: randomBytes(tokenSize / 2).toString(DEFAULT_TOKEN_BUFFER_ENCODING),
    expiryDate: addMinutes(new Date(), expiryTimeMinutes),
    userEmail,
  };
  await PasswordResetVerificationToken.create(passwordResetVerificationToken);

  logger.info(`Generated password reset verification token for user with e-mail: <${userEmail}>`);
  return passwordResetVerificationToken;
};
