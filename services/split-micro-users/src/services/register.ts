import {GenerateIdFunction} from '@split-common/split-auth';
import {RegistrationStatus} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {isAfter} from 'date-fns/isAfter';
import winston from 'winston';

import {RegistrationVerificationTokenDAO, UserDAO} from '../dao';

import {PasswordService} from './index';

export const makeRegisterService = (
    logger: winston.Logger,
    userDao: UserDAO,
    generateId: GenerateIdFunction,
    passwordService: PasswordService,
    registrationVerificationTokenDao: RegistrationVerificationTokenDAO,
) => {
  return {
    registerUser: async (email: string, firstName: string, lastName: string, password: string) => {
      const existingGoogleUser = await userDao.getOneTransformed({email});
      if (existingGoogleUser) {
        existingGoogleUser.firstName = firstName;
        existingGoogleUser.lastName = lastName;
        existingGoogleUser.password = await passwordService.encodePassword(password);
      }
      return (existingGoogleUser) ?
        {status: HttpStatus.OK, data: await userDao.updateOneAndReturnTransformed(existingGoogleUser)} :
        {status: HttpStatus.OK, data: await userDao.createAndReturnTransformed({
          id: await generateId(),
          email,
          firstName,
          lastName,
          password: await passwordService.encodePassword(password),
          emailVerified: false,
          googleId: undefined,
        })};
    },
    confirmRegistration: async (tokenValue: string) => {
      const token = await registrationVerificationTokenDao.getOneTransformed({value: tokenValue});
      if (!token) {
        return {status: HttpStatus.BAD_REQUEST, data: {status: RegistrationStatus[RegistrationStatus.INVALID_TOKEN]}};
      }

      const user = await userDao.getOneTransformed({email: token.userEmail});
      if (!user) {
        logger.error(`No user found for registration verification token with userEmail: <${token.userEmail}>`);
        return {status: HttpStatus.INTERNAL_SERVER_ERROR, data: {status: RegistrationStatus[RegistrationStatus.FAILURE]}};
      }

      if (user.emailVerified && !user.googleId) {
        logger.error(`User found for registration verification token with userEmail: <${token.userEmail}> already verified`);
        return {status: HttpStatus.BAD_REQUEST, data: {status: RegistrationStatus[RegistrationStatus.EMAIL_ALREADY_VERIFIED]}};
      }

      if (isAfter(new Date(), token.expiryDate)) {
        return {status: HttpStatus.BAD_REQUEST, data: {status: RegistrationStatus[RegistrationStatus.EMAIL_VERIFICATION_EXPIRED]}};
      }

      user.emailVerified = true;
      await userDao.updateOne(user);
      token.expiryDate = new Date();
      await registrationVerificationTokenDao.updateOne(token);
      logger.info(`Successful registration confirmation for user with e-mail: <${user.email}>`);
      return {status: HttpStatus.OK, data: {status: RegistrationStatus[RegistrationStatus.SUCCESS]}};
    },
  };
};
