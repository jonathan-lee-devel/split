import {AuthenticatedRequest, Response} from 'express';
import logger from '../logger';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '../constants/token/token';
import {environment} from '../environment';
import {Model} from 'mongoose';
import {TokenHold} from '../models/tokens/TokenHold';
import addMinutes from 'date-fns/addMinutes';

export const makeLoginSuccessTokenHold = (TokenHold: Model<TokenHold>) => async (req: AuthenticatedRequest, res: Response) => {
  logger.info(`Successful Google authentication for: <${req.user.email}>`);
  const token = jwt.sign({email: req.user.email}, '12345');
  const tokenCode = crypto.randomBytes(DEFAULT_TOKEN_SIZE / 2).toString('hex');
  await TokenHold.create({
    email: req.user.email,
    token,
    expiryDate: addMinutes(new Date(), DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES),
  });
  res.redirect(`${environment.FRONT_END_URL}/google-login-success?tokenCode=${encodeURIComponent(tokenCode)}`);
};
