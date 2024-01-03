import {randomBytes} from 'crypto';

import {GenerateIdFunction} from '@split-common/split-auth';
import {DEFAULT_TOKEN_BUFFER_ENCODING, DEFAULT_TOKEN_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {addMinutes} from 'date-fns/addMinutes';

import {PasswordResetVerificationTokenDAO} from '../dao';
import {RegistrationVerificationTokenDAO} from '../dao/RegistrationVerificationTokenDAO';

export const makeTokenService = (
    registrationVerificationTokenDao: RegistrationVerificationTokenDAO,
    passwordResetTokenDao: PasswordResetVerificationTokenDAO,
    generateId: GenerateIdFunction,
) => {
  return {
    generateRegistrationVerificationToken: async (userEmail: string) => {
      const registrationVerificationToken = await registrationVerificationTokenDao
          .createAndReturnTransformed({
            id: await generateId(),
            value: randomBytes(DEFAULT_TOKEN_SIZE / 2).toString(DEFAULT_TOKEN_BUFFER_ENCODING),
            expiryDate: addMinutes(new Date(), DEFAULT_TOKEN_EXPIRY_TIME_MINUTES),
            userEmail,
          });

      return (registrationVerificationToken) ?
        {status: HttpStatus.OK, data: {token: registrationVerificationToken}} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Could not generate registration verification token for e-mail: ${userEmail}`};
    },
    generatePasswordResetVerificationToken: async (userEmail: string) => {
      const passwordResetToken = await passwordResetTokenDao
          .createAndReturnTransformed({
            id: await generateId(),
            value: randomBytes(DEFAULT_TOKEN_SIZE / 2).toString(DEFAULT_TOKEN_BUFFER_ENCODING),
            expiryDate: addMinutes(new Date(), DEFAULT_TOKEN_EXPIRY_TIME_MINUTES),
            userEmail,
          });

      return (passwordResetToken) ?
        {status: HttpStatus.OK, data: {token: passwordResetToken}} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Could not generate password reset verification token for e-mail: ${userEmail}`};
    },
  };
};
