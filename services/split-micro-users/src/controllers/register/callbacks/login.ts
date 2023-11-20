import winston from 'winston';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {Model} from 'mongoose';
import {User} from '../../../models/users/User';
import {LoginRequestBody, LoginRequestQuery} from '../schemas/login';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const makeLoginCallback = (
    logger: winston.Logger,
    User: Model<User>,
): AnonymousEndpointCallback<LoginRequestBody, LoginRequestQuery> => async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email}).exec();
  if (!user) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: 'User does not exist'});
  }

  const token = jwt.sign({email}, '12345', {expiresIn: '1h'});
  const refreshToken = crypto.randomBytes(64).toString('hex');

  return res.status(HttpStatus.OK).json({email, password, token, refreshToken});
};
