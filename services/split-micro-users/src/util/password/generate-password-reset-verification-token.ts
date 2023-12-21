import {randomBytes} from 'crypto';

import {PasswordResetVerificationToken} from '@split-common/split-auth';
import {DEFAULT_TOKEN_BUFFER_ENCODING, DEFAULT_TOKEN_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {addMinutes} from 'date-fns/addMinutes';
import {Model} from 'mongoose';
import winston from 'winston';

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
