import winston from 'winston';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {RegisterRequestBody, RegisterRequestQuery} from '../schemas/register';
import {Model} from 'mongoose';
import {User} from '../../../models/users/User';
import {encodePassword} from '../../../util';

export const makeRegisterCallback = (
    logger: winston.Logger,
    User: Model<User>,
): AnonymousEndpointCallback<RegisterRequestBody, RegisterRequestQuery> => async (req, res) => {
  const {email, password, confirmPassword} = req.body;
  if (password !== confirmPassword) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: 'Passwords do not match'});
  }
  await User.create({
    email,
    password: await encodePassword(password),
    emailVerified: true,
    googleId: undefined,
    firstName: undefined,
    lastName: undefined,
  });
  return res.status(HttpStatus.OK).json({email, password, confirmPassword});
};
