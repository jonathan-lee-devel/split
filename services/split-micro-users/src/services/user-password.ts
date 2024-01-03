import {MailToSendMessage, PASSWORD_RESET_EMAIL_SUBJECT, PasswordResetStatus} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {RabbitMQConnection} from '@split-common/split-service-config';
import {isAfter} from 'date-fns/isAfter';
import winston from 'winston';

import {PasswordResetVerificationTokenDAO, UserDAO} from '../dao';

import {PasswordService, TokenService} from './index';

export const makeUserPasswordService = (
    logger: winston.Logger,
    userDao: UserDAO,
    passwordResetVerificationTokenDao: PasswordResetVerificationTokenDAO,
    tokenService: TokenService,
    passwordService: PasswordService,
    mailToSendRabbitMQConnectionPromise: Promise<RabbitMQConnection<MailToSendMessage>>,
    frontEndUrl: string,
) => {
  return {
    resetUserPassword: async (email: string) => {
      const user = await userDao.getOneTransformed({email, emailVerified: true});
      if (!user) { // Do not give attackers any indication of user's existence
        return {status: HttpStatus.OK, data: {status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]}};
      }

      await passwordResetVerificationTokenDao.deleteOne({userEmail: email});
      const generateNewPasswordResetTokenResponse = await tokenService.generatePasswordResetVerificationToken(email);
      if (generateNewPasswordResetTokenResponse.status !== HttpStatus.OK) {
        return generateNewPasswordResetTokenResponse;
      }

      try {
        await (await mailToSendRabbitMQConnectionPromise).sendData('mail-to-send', {
          toEmail: email,
          subject: PASSWORD_RESET_EMAIL_SUBJECT,
          // Token data known to be defined is status OK
          html: `<h4>Please click the following link to reset your password: <a href="${frontEndUrl}/reset-password/confirm/${generateNewPasswordResetTokenResponse.data!.token.value}">Reset Password</a></h4>`,
        });
      } catch (err) {
        logger.error(`Error while trying to send e-mail to queue: ${err}`);
      }

      return {status: HttpStatus.OK, data: {status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]}};
    },
    confirmUserPasswordReset: async (password: string, tokenValue: string) => {
      const token = await passwordResetVerificationTokenDao.getOneTransformed({value: tokenValue});
      if (!token) {
        return {status: HttpStatus.BAD_REQUEST, data: {status: PasswordResetStatus[PasswordResetStatus.INVALID_TOKEN]}};
      }

      const user = await userDao.getOneTransformed({email: token.userEmail});
      if (!user) {
        logger.error(`No user exists for token with value: ${tokenValue}`);
        return {status: HttpStatus.INTERNAL_SERVER_ERROR, data: {status: PasswordResetStatus[PasswordResetStatus.FAILURE]}};
      }

      if (isAfter(token.expiryDate, new Date())) {
        return {status: HttpStatus.BAD_REQUEST, data: {status: PasswordResetStatus[PasswordResetStatus.EMAIL_VERIFICATION_EXPIRED]}};
      }

      user.password = await passwordService.encodePassword(password);
      await userDao.updateOne(user);
      token.expiryDate = new Date();
      await passwordResetVerificationTokenDao.updateOne(token);

      return {status: HttpStatus.OK, data: {status: PasswordResetStatus[PasswordResetStatus.SUCCESS]}};
    },
  };
};
