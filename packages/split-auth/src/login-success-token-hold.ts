import {AuthenticatedRequest, Response} from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {Model} from 'mongoose';
import winston from 'winston';
import addMinutes from 'date-fns/addMinutes';
import {DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {TokenHold, User} from './models';

export const makeLoginSuccessTokenHoldCallback = (
    logger: winston.Logger,
    jwtSecret: string,
    frontEndUrl: string,
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
  }, jwtSecret);
  const tokenCode = crypto.randomBytes(DEFAULT_TOKEN_SIZE / 2).toString('hex');
  const refreshToken = crypto.randomBytes(DEFAULT_TOKEN_SIZE / 2).toString('hex');
  await TokenHold.create({
    email: req.user.email,
    token,
    tokenCode,
    refreshToken,
    expiryDate: addMinutes(new Date(), DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES),
  });
  const redirectUrl = `${frontEndUrl}/google-login-success?tokenCode=${encodeURIComponent(tokenCode)}`;
  logger.info(`Redirecting user <${req.user.email}> to: ${redirectUrl}`);
  res.redirect(redirectUrl);
};
