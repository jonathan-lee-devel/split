import {randomBytes} from 'crypto';

import {GenerateIdFunction} from '@split-common/split-auth';
import {
  DEFAULT_TOKEN_BUFFER_ENCODING,
  DEFAULT_TOKEN_EXPIRY_TIME_MINUTES,
  DEFAULT_TOKEN_SIZE,
  MailToSendMessage,
  REGISTRATION_CONFIRMATION_EMAIL_SUBJECT,
  RegistrationStatus,
} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {RabbitMQConnection} from '@split-common/split-service-config';
import {addMinutes} from 'date-fns/addMinutes';
import winston from 'winston';

import {UserDAO} from '../dao';
import {RegistrationVerificationTokenDAO} from '../dao/RegistrationVerificationTokenDAO';
import {RegistrationVerificationTokenDto} from '../dtos';
import {EncodePasswordFunction} from '../util/password/encode-password';

export const makeRegisterService = (
    logger: winston.Logger,
    frontEndUrl: string,
    userDao: UserDAO,
    registrationVerificationTokenDao: RegistrationVerificationTokenDAO,
    generateId: GenerateIdFunction,
    encodePassword: EncodePasswordFunction,
    mailToSendRabbitMQConnectionPromise: Promise<RabbitMQConnection<MailToSendMessage>>,
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
    registerUser: async (email: string, firstName: string, lastName: string, password: string) => {
      const existingGoogleUser = await userDao.getOneTransformed({email});
      if (existingGoogleUser) {
        existingGoogleUser.firstName = firstName;
        existingGoogleUser.lastName = lastName;
        existingGoogleUser.password = await encodePassword(password);
      } else {
        await userDao.createAndReturnTransformed({
          id: await generateId(),
          email,
          firstName,
          lastName,
          password: await encodePassword(password),
          emailVerified: false,
          googleId: undefined,
        });
      }
    },
    sendRegistrationVerificationEmail: async (email: string, token: RegistrationVerificationTokenDto) => {
      await (await mailToSendRabbitMQConnectionPromise).sendData('mail-to-send', {
        toEmail: email,
        subject: REGISTRATION_CONFIRMATION_EMAIL_SUBJECT,
        html: `<h4>Please click the following link to verify your account: <a href="${frontEndUrl}/register/confirm/${token.value}">Verify Account</a></h4>`,
      });
      return {status: HttpStatus.OK, data: {status: RegistrationStatus[RegistrationStatus.AWAITING_EMAIL_VERIFICATION]}};
    },
  };
};
