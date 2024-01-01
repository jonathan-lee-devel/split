import {randomBytes} from 'crypto';

import {GenerateIdFunction} from '@split-common/split-auth';
import {DEFAULT_TOKEN_BUFFER_ENCODING, DEFAULT_TOKEN_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {addMinutes} from 'date-fns/addMinutes';
import winston from 'winston';

import {UserDAO} from '../dao';
import {RegistrationVerificationTokenDAO} from '../dao/RegistrationVerificationTokenDAO';

export const makeRegisterService = (
    logger: winston.Logger,
    userDao: UserDAO,
    registrationVerificationTokenDao: RegistrationVerificationTokenDAO,
    generateId: GenerateIdFunction,
) => {
  return {
    handleExistingUser: async (email: string) => {
      const existingUser = await userDao.getOneTransformed({email});
      if (!existingUser) {
        logger.info(`No user found for e-mail: <${email}>, deleting any possible associated tokens`);
        await registrationVerificationTokenDao.deleteOne({userEmail: email});
        // await PasswordResetVerificationToken.deleteOne({userEmail: email}).exec();
        return false;
      }
      if (existingUser && !existingUser.emailVerified && !existingUser.googleId) {
        logger.info(`Existing user: <${email}> detected without verified e-mail or Google ID, deleting user and any possible associated tokens`);
        await userDao.deleteOne({email});
        await registrationVerificationTokenDao.deleteOne({userEmail: email});
        // await PasswordResetVerificationToken.deleteOne({userEmail: email});
        return false;
      }
      // Allow user to register if already registered with Google
      return !(existingUser?.emailVerified && existingUser.googleId && !existingUser.password);
    },
    generateRegistrationVerificationToken: async (userEmail: string) => {
      const registrationVerificationToken = await registrationVerificationTokenDao
          .createAndReturnTransformed({
            id: await generateId(),
            value: randomBytes(DEFAULT_TOKEN_SIZE / 2).toString(DEFAULT_TOKEN_BUFFER_ENCODING),
            expiryDate: addMinutes(new Date(), DEFAULT_TOKEN_EXPIRY_TIME_MINUTES),
            userEmail,
          });

      return (registrationVerificationToken) ?
        {status: HttpStatus.OK, data: registrationVerificationToken} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Could not generate registration verification token for e-mail: ${userEmail}`};
    },
  };
};
