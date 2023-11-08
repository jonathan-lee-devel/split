import winston from 'winston';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {ResetPasswordRequestBody, ResetPasswordRequestQuery} from '../schemas/reset-password';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {Model} from 'mongoose';
import {User} from '../../../models/users/User';
import {PasswordResetVerificationToken} from '../../../models/users/password/PasswordResetVerificationToken';
import {GeneratePasswordResetVerificationTokenFunction} from '../../../util/password/generate-password-reset-verification-token';
import {SendMailFunction} from '../../../util/email/send-mail';
import {PasswordResetStatus} from '../../../lib/enums/password/PasswordResetStatus';
import {Environment} from '../../../environment';
import {PASSWORD_RESET_EMAIL_SUBJECT} from '../../../constants/password/password';

export const makeResetPasswordCallback = (
    logger: winston.Logger,
    User: Model<User>,
    PasswordResetVerificationToken: Model<PasswordResetVerificationToken>,
    generatePasswordResetVerificationToken: GeneratePasswordResetVerificationTokenFunction,
    sendMail: SendMailFunction,
    environment: Environment,
): AnonymousEndpointCallback<ResetPasswordRequestBody, ResetPasswordRequestQuery> => async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email}).exec();
  if (!user) {
    return res.status(HttpStatus.OK).json({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
  }

  const passwordResetVerificationToken = await PasswordResetVerificationToken.findOne({userEmail: email}).exec();
  if (!passwordResetVerificationToken) {
    logger.error(`Password reset verification token does not exist for user: <${email}>`);
    return res.status(HttpStatus.OK).json({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
  }

  await PasswordResetVerificationToken.deleteOne({userEmail: email}).exec();
  const newPasswordResetVerificationToken = await generatePasswordResetVerificationToken(email);

  sendMail(email, PASSWORD_RESET_EMAIL_SUBJECT,
      `<h4>Please click the following link to reset your password: <a href="${environment.FRONT_END_URL}/reset-password/confirm/${newPasswordResetVerificationToken.value}">Reset Password</a></h4>`)
      .catch((reason) => {
        logger.error(`An error has occurred while sending mail: ${reason}`);
      });

  return res.status(HttpStatus.OK).json({status: PasswordResetStatus[PasswordResetStatus.AWAITING_EMAIL_VERIFICATION]});
};
