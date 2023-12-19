import {User} from '@split-common/split-auth';
import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAnonymous} from '@split-common/split-http';
import {RabbitMQConnection} from '@split-common/split-service-config/dist/rabbitmq-connection';
import {Model} from 'mongoose';
import winston from 'winston';

import {encodePassword} from '../../../util';
import {RegisterRequestBody, RegisterRequestQuery} from '../schemas/register';

export const makeRegisterCallback = (
    logger: winston.Logger,
    User: Model<User>,
    rabbitMQConnection: Promise<RabbitMQConnection>,
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
        if (existingUser?.emailVerified && existingUser?.password) {
          return res.status(HttpStatus.BAD_REQUEST).json({error: 'User with that e-mail address already exists'});
        }
        if (existingUser && !existingUser.emailVerified) {
          await User.deleteOne({email});
        }
        if (existingUser?.googleId) {
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
        await (await rabbitMQConnection).sendData('mail-to-send', {email: 'jonathan.lee.devel@gmail.com'});
        return res.status(HttpStatus.OK).json({status: 'AWAITING_EMAIL_VERIFICATION'});
      }) as any;
