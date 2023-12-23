import {PasswordResetVerificationToken, User} from '@split-common/split-auth';
import {PasswordResetStatus} from '@split-common/split-constants';
import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAnonymous} from '@split-common/split-http';
import {Model} from 'mongoose';
import winston from 'winston';

import {EncodePasswordFunction} from '../../../util/password/encode-password';
import {ConfirmPasswordResetRequestBody, ConfirmPasswordResetRequestQuery} from '../schemas/confirm-password-reset';

export const makeConfirmPasswordResetCallback = (
    logger: winston.Logger,
    PasswordResetVerificationToken: Model<PasswordResetVerificationToken>,
    User: Model<User>,
    encodePassword: EncodePasswordFunction,
): AnonymousEndpointCallback<ConfirmPasswordResetRequestBody, ConfirmPasswordResetRequestQuery> =>
  wrapTryCatchAnonymous<ConfirmPasswordResetRequestBody, ConfirmPasswordResetRequestQuery>(async (req, res) => {
    const {password, confirmPassword, tokenValue} = req.body;
    const token = await PasswordResetVerificationToken.findOne({value: tokenValue}).exec();
    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).json({status: PasswordResetStatus[PasswordResetStatus.INVALID_TOKEN]});
    }

    const user = await User.findOne({email: token.userEmail}).exec();
    if (!user) {
      logger.error(`No user exists for token with value: ${tokenValue}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: PasswordResetStatus[PasswordResetStatus.FAILURE]});
    }

    if (token.expiryDate.getTime() < new Date().getTime()) {
      return res.status(HttpStatus.BAD_REQUEST).json({status: PasswordResetStatus[PasswordResetStatus.EMAIL_VERIFICATION_EXPIRED]});
    }

    if (password !== confirmPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: 'Passwords do not match'});
    }

    user.password = await encodePassword(password);
    await user.save();
    token.expiryDate = new Date();
    await token.save();

    return res.status(HttpStatus.OK).json({status: PasswordResetStatus[PasswordResetStatus.SUCCESS]});
  }) as any;
