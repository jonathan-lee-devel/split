import winston from 'winston';
import {Model} from 'mongoose';
import {User} from '@split-common/split-auth';
import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAnonymous} from '@split-common/split-http';
import {RegisterRequestBody, RegisterRequestQuery} from '../schemas/register';
import {encodePassword} from '../../../util';

export const makeRegisterCallback = (
    logger: winston.Logger,
    User: Model<User>,
): AnonymousEndpointCallback<RegisterRequestBody, RegisterRequestQuery> =>
  wrapTryCatchAnonymous<RegisterRequestBody, RegisterRequestQuery>(
      async (req, res) => {
        const {email,
          firstName,
          lastName,
          password,
          confirmPassword,
          acceptTermsAndConditions} = req.body;
        if (password !== confirmPassword) {
          return res.status(HttpStatus.BAD_REQUEST).json({error: 'Passwords do not match'});
        }
        if (!acceptTermsAndConditions) {
          return res.status(HttpStatus.BAD_REQUEST).json({error: 'You must accept the terms and conditions'});
        }
        const existingUser = await User.findOne({email});
        if (existingUser && existingUser.emailVerified && existingUser.password) {
          return res.status(HttpStatus.BAD_REQUEST).json({error: 'User with that e-mail address already exists'});
        }
        if (existingUser && !existingUser.emailVerified) {
          await User.deleteOne({email});
        }
        if (existingUser && existingUser.googleId) {
          existingUser.password = await encodePassword(password);
          await existingUser.save();
        } else {
          await User.create({
            email,
            firstName,
            lastName,
            password: await encodePassword(password),
            emailVerified: true,
            googleId: undefined,
          });
        }
        logger.info(`Registration process initiated for user: <${email}>`);
        return res.status(HttpStatus.OK).json({status: 'AWAITING_EMAIL_VERIFICATION'});
      }) as any;
