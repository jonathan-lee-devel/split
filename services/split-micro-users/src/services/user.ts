import {HttpStatus} from '@split-common/split-http';
import winston from 'winston';

import {UserDAO} from '../dao';
import {PasswordResetVerificationTokenDAO} from '../dao/PasswordResetVerificationTokenDAO';
import {RegistrationVerificationTokenDAO} from '../dao/RegistrationVerificationTokenDAO';

export const makeUserService = (
    logger: winston.Logger,
    userDao: UserDAO,
    registrationVerificationTokenDao: RegistrationVerificationTokenDAO,
    passwordResetVerificationTokenDao: PasswordResetVerificationTokenDAO,
) => {
  return {
    handleExistingUser: async (email: string) => {
      const existingUser = await userDao.getOneTransformed({email});
      if (!existingUser) {
        logger.info(`No user found for e-mail: <${email}>, deleting any possible associated tokens`);
        await registrationVerificationTokenDao.deleteOne({userEmail: email});
        await passwordResetVerificationTokenDao.deleteOne({userEmail: email});
        return {status: HttpStatus.OK};
      }
      if (existingUser && !existingUser.emailVerified && !existingUser.googleId) {
        logger.info(`Existing user: <${email}> detected without verified e-mail or Google ID, deleting user and any possible associated tokens`);
        await userDao.deleteOne({email});
        await registrationVerificationTokenDao.deleteOne({userEmail: email});
        await passwordResetVerificationTokenDao.deleteOne({userEmail: email});
        return {status: HttpStatus.OK};
      }
      // Allow user to register if already registered with Google
      return (existingUser?.emailVerified && existingUser.googleId && !existingUser.password) ?
        {status: HttpStatus.OK} :
        {status: HttpStatus.CONFLICT};
    },
  };
};
