import {AuthenticatedRequest, Response} from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {Model} from 'mongoose';
import addMinutes from 'date-fns/addMinutes';
import {DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split/split-constants';
import {TokenHold, User} from '@split/split-auth-config';
import logger from '../logger';
import {Environment} from '../environment';
import {HttpStatus} from './enums/HttpStatus';

export const makeLoginSuccessTokenHold = (
    environment: Environment,
    TokenHold: Model<TokenHold>,
    User: Model<User>,
) => async (req: AuthenticatedRequest, res: Response) => {
  logger.info(`Successful Google authentication for: <${req.user.email}>`);
  const user = await User.findOne({email: req.user.email}).exec();
  if (!user) {
    logger.error(`User <${req.user.email}> not found after successful Google authentication`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
  const token = jwt.sign({
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    emailVerified: user.emailVerified,
  }, environment.JWT_SECRET);
  const tokenCode = crypto.randomBytes(DEFAULT_TOKEN_SIZE / 2).toString('hex');
  const refreshToken = crypto.randomBytes(DEFAULT_TOKEN_SIZE / 2).toString('hex');
  await TokenHold.create({
    email: req.user.email,
    token,
    tokenCode,
    refreshToken,
    expiryDate: addMinutes(new Date(), DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES),
  });
  logger.info(`Redirecting user <${req.user.email}> to: ${environment.FRONT_END_URL}/google-login-success?tokenCode=${encodeURIComponent(tokenCode)}`);
  res.redirect(`${environment.FRONT_END_URL}/google-login-success?tokenCode=${encodeURIComponent(tokenCode)}`);
};
