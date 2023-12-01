import winston from 'winston';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import {Model} from 'mongoose';
import {User} from '@split/split-auth-config';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {LoginRequestBody, LoginRequestQuery} from '../schemas/login';
import {Environment} from '../../../environment';
import {DEFAULT_TOKEN_SIZE} from '@split/split-constants';

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
  if (!user.password) {
    logger.error(`User: <${user.email}> does not have a hashed password!`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  const token = jwt.sign(
      {email, firstName: user.firstName, lastName: user.lastName, emailVerified: user.emailVerified},
      environment.JWT_SECRET,
      {expiresIn: '1h'},
  );
  logger.silly(`Signed token with payload: ${{email, firstName: user.firstName, lastName: user.lastName}}`);
  const refreshToken = crypto.randomBytes(DEFAULT_TOKEN_SIZE / 2).toString('hex');

  return res.status(HttpStatus.OK).json({token, refreshToken});
};
