import crypto from 'crypto';

import {DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {addMinutes} from 'date-fns/addMinutes';
import {AuthenticatedRequest, Response} from 'express';
import jwt from 'jsonwebtoken';
import {Model} from 'mongoose';
import winston from 'winston';

import {GenerateIdFunction} from './generate-id';
import {TokenHold, User} from './models';

/**
 * Function that handles the callback for a successful login using Google authentication.
 *
 * @param {winston.Logger} logger - The logger instance to use for logging.
 * @param {string} jwtSecret - The secret key used for JWT token generation.
 * @param {string} frontEndUrl - The URL of the front-end application.
 * @param {GenerateIdFunction} generateId - used to generate ID for token hold entity
 * @param {Model<TokenHold>} TokenHold - The Mongoose model for the TokenHold collection.
 * @param {Model<User>} User - The Mongoose model for the User collection.
 * @return {Function} - The handler function for the login success callback.
 */
export const makeLoginSuccessTokenHoldCallback = (
    logger: winston.Logger,
    jwtSecret: string,
    frontEndUrl: string,
    generateId: GenerateIdFunction,
    TokenHold: Model<TokenHold>,
    User: Model<User>,
): Function => async (req: AuthenticatedRequest, res: Response) => {
  try {
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
      id: await generateId(),
      email: req.user.email,
      token,
      tokenCode,
      refreshToken,
      expiryDate: addMinutes(new Date(), DEFAULT_TOKEN_HOLD_EXPIRY_TIME_MINUTES),
    });
    const redirectUrl = `${frontEndUrl}/google-login-success?tokenCode=${encodeURIComponent(tokenCode)}`;
    logger.info(`Redirecting user <${req.user.email}> to: ${redirectUrl}`);
    res.redirect(redirectUrl);
  } catch (err) {
    logger.error(`Error occurred while handling login success: ${err}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
