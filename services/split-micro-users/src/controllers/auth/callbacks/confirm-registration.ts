import {RegistrationVerificationToken, User} from '@split-common/split-auth';
import {RegistrationStatus} from '@split-common/split-constants';
import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAnonymous} from '@split-common/split-http';
import {Model} from 'mongoose';
import winston from 'winston';

import {ConfirmRegistrationRequestBody, ConfirmRegistrationRequestQuery} from '../schemas/confirm-registration';

export const makeConfirmRegistrationCallback = (
    logger: winston.Logger,
    User: Model<User>,
    RegistrationVerificationToken: Model<RegistrationVerificationToken>,
): AnonymousEndpointCallback<ConfirmRegistrationRequestBody, ConfirmRegistrationRequestQuery> =>
  wrapTryCatchAnonymous<ConfirmRegistrationRequestBody, ConfirmRegistrationRequestQuery>(async (req, res) => {
    const {tokenValue} = req.body;
    const registrationVerificationToken = await RegistrationVerificationToken.findOne({value: tokenValue}).exec();
    if (!registrationVerificationToken) {
      return res.status(HttpStatus.BAD_REQUEST).json({status: RegistrationStatus[RegistrationStatus.INVALID_TOKEN]});
    }

    const user = await User.findOne({email: registrationVerificationToken.userEmail}).exec();
    if (!user) {
      logger.error(`No user found for registration verification token with userEmail: <${registrationVerificationToken.userEmail}>`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: RegistrationStatus[RegistrationStatus.FAILURE]});
    }

    if (user.emailVerified) {
      logger.error(`User found for registration verification token with userEmail: <${registrationVerificationToken.userEmail}> already verified`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: RegistrationStatus[RegistrationStatus.FAILURE]});
    }

    if (registrationVerificationToken.expiryDate.getTime() < new Date().getTime()) {
      return res.status(HttpStatus.BAD_REQUEST).json({status: RegistrationStatus[RegistrationStatus.EMAIL_VERIFICATION_EXPIRED]});
    }

    user.emailVerified = true;
    await user.save();
    registrationVerificationToken.expiryDate = new Date();
    await registrationVerificationToken.save();
    logger.info(`Successful registration confirmation for user with e-mail: <${user.email}>`);

    return res.status(HttpStatus.OK).json({status: RegistrationStatus[RegistrationStatus.SUCCESS]});
  }) as any;
