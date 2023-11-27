import {AuthenticatedRequest, Response} from 'express';
import logger from '../logger';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import addMinutes from 'date-fns/addMinutes';
import {Model} from 'mongoose';
import {Environment} from '../environment';
import {DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '../constants/token/token';
import {TokenHold} from '../models/tokens/TokenHold';

export const makeLoginSuccessTokenHold = (
    environment: Environment,
    TokenHold: Model<TokenHold>,
) => async (req: AuthenticatedRequest, res: Response) => {
  logger.info(`Successful Google authentication for: <${req.user.email}>`);
  const token = jwt.sign({
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
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
  logger.silly(`Redirecting user to: ${environment.FRONT_END_URL}/google-login-success?tokenCode=${encodeURIComponent(tokenCode)}`);
  res.redirect(`${environment.FRONT_END_URL}/google-login-success?tokenCode=${encodeURIComponent(tokenCode)}`);
};
