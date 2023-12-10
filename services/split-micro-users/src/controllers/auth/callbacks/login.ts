import winston from 'winston';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {Model} from 'mongoose';
import {User} from '@split-common/split-auth';
import {DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {AnonymousEndpointCallback, HttpStatus} from '@split-common/split-http';
import {LoginRequestBody, LoginRequestQuery} from '../schemas/login';
import {Environment} from '../../../environment';
import bcrypt from 'bcrypt';

export const makeLoginCallback = (
    logger: winston.Logger,
    environment: Environment,
    User: Model<User>,
): AnonymousEndpointCallback<LoginRequestBody, LoginRequestQuery> => async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email}).exec();
  if (!user) {
    logger.silly(`User: <${email}> not found during login attempt`);
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }
  if (!user.emailVerified) {
    logger.silly(`User: <${user.email}> login blocked due to lack of e-mail verification`);
    return res.status(HttpStatus.UNAUTHORIZED).json({error: 'You must verify your e-mail address by re-registering'});
  }
  if (!user.password) {
    logger.error(`User: <${user.email}> does not have a hashed password!`);
    return res.status(HttpStatus.UNAUTHORIZED).json({error: 'User does not have a password, you must register'});
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  const payload = {email, firstName: user.firstName, lastName: user.lastName, emailVerified: user.emailVerified};
  const token = jwt.sign(payload, environment.JWT_SECRET, {expiresIn: '1h'});
  logger.silly(`Signed token with payload: ${JSON.stringify(payload)}`);
  const refreshToken = crypto.randomBytes(DEFAULT_TOKEN_SIZE / 2).toString('hex');

  return res.status(HttpStatus.OK).json({token, refreshToken});
};
