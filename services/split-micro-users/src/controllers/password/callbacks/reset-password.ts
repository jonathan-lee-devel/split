import {PasswordResetVerificationToken, User} from '@split-common/split-auth';
import {MailToSendMessage, PASSWORD_RESET_EMAIL_SUBJECT, PasswordResetStatus} from '@split-common/split-constants';
import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAnonymous} from '@split-common/split-http';
import {RabbitMQConnection} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Environment} from '../../../environment';
import {GeneratePasswordResetVerificationTokenFunction} from '../../../util/password/generate-password-reset-verification-token';
import {ResetPasswordRequestBody, ResetPasswordRequestQuery} from '../schemas/reset-password';


export const makeResetPasswordCallback = (
    logger: winston.Logger,
    User: Model<User>,
    PasswordResetVerificationToken: Model<PasswordResetVerificationToken>,
    generatePasswordResetVerificationToken: GeneratePasswordResetVerificationTokenFunction,
    rabbitMQConnection: Promise<RabbitMQConnection<MailToSendMessage>>,
    environment: Environment,
): AnonymousEndpointCallback<ResetPasswordRequestBody, ResetPasswordRequestQuery> =>
  wrapTryCatchAnonymous<ResetPasswordRequestBody, ResetPasswordRequestQuery>(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email}).exec();
    if (!user) { // Do not give attackers any indication of user's existence
      return res.status(HttpStatus.OK).json({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
    }

    const passwordResetVerificationToken = await PasswordResetVerificationToken.findOne({userEmail: email}).exec();
    if (!passwordResetVerificationToken) {
      logger.error(`Password reset verification token does not exist for user: <${email}>`);
      return res.status(HttpStatus.OK).json({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
    }

    await PasswordResetVerificationToken.deleteOne({userEmail: email}).exec();
    const newPasswordResetVerificationToken = await generatePasswordResetVerificationToken(email);

    try {
      await (await rabbitMQConnection).sendData('mail-to-send', {
        toEmail: email,
        subject: PASSWORD_RESET_EMAIL_SUBJECT,
        html: `<h4>Please click the following link to reset your password: <a href="${environment.FRONT_END_URL}/reset-password/confirm/${newPasswordResetVerificationToken.value}">Reset Password</a></h4>`,
      });
    } catch (err) {
      logger.error(`Error while trying to send e-mail to queue: ${err}`);
    }

    return res.status(HttpStatus.OK).json({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
  }) as any;
