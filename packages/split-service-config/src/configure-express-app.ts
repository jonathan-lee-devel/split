import {makeLoginSuccessTokenHoldCallback, TokenHold, User} from '@split-common/split-auth';
import {DEFAULT_RATE_LIMIT_PER_WINDOW, DEFAULT_RATE_LIMIT_WINDOW_MS} from '@split-common/split-constants/dist/rate-limit';
import {makeErrorResponseHandler, notFoundCallback} from '@split-common/split-http';
import {makeLogResponseTime} from '@split-common/split-observability';
import compression from 'compression';
import cors from 'cors';
import express, {Express, Router} from 'express';
import helmet from 'helmet';
import {Model} from 'mongoose';
import passport from 'passport';
import winston from 'winston';

import {makeRateLimiter} from './rate-limiter';


/**
 * Configure the Express application with specified middleware and routes.
 *
 * @param {winston.Logger} logger - The logger instance.
 * @param {Router} routes - The router instance containing all the routes.
 * @param {string} serviceName - The name of the service.
 * @param {string} jwtSecret - The secret key used for generating JWT.
 * @param {string} frontEndUrl - The URL of the frontend.
 * @param {passport.PassportStatic} [passport] - The passport instance for authentication (optional).
 * @param {Model<User>} [User] - User model used to initialize Google verification callback for users service
 * @param {Model<TokenHold>} [TokenHold] - Token hold model used to initialize Google redirect callback for users service
 * @param {number} [passportRateLimitWindowMs] = Rate limit window for passport requests in milliseconds
 * @param {number} [passportRateLimitPerWindow] - Rate limit requests per window for passport requests
 *
 * @return {Express} The configured Express application.
 */
export const configureExpressApp = (
    logger: winston.Logger,
    routes: Router,
    serviceName: string,
    jwtSecret: string,
    frontEndUrl: string,
    passport?: passport.PassportStatic,
    User?: Model<User>,
    TokenHold?: Model<TokenHold>,
    passportRateLimitWindowMs?: number,
    passportRateLimitPerWindow?: number,
): Express => {
  const app: Express = express();

  app.use(helmet.hidePoweredBy());
  app.use(makeLogResponseTime(logger, serviceName));
  app.use(compression());
  app.use(cors({credentials: true, optionsSuccessStatus: 200, origin: frontEndUrl}));
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(routes);
  if (passport && User && TokenHold) { // Routes specific to the users service for handling login with Google
    const passportRateLimiter = makeRateLimiter(
        passportRateLimitWindowMs ?? DEFAULT_RATE_LIMIT_WINDOW_MS,
        passportRateLimitPerWindow ?? DEFAULT_RATE_LIMIT_PER_WINDOW,
    );
    app.get('/users/auth/google', passportRateLimiter, passport.authenticate('google', {scope: ['email', 'profile']}));
    app.get(
        '/users/auth/google/redirect',
        passportRateLimiter,
        passport.authenticate('google', {
          failureRedirect: frontEndUrl,
          session: false,
        }),
      makeLoginSuccessTokenHoldCallback(
          logger,
          jwtSecret,
          frontEndUrl,
          TokenHold,
          User,
      ) as any,
    );
  }
  app.use(notFoundCallback);
  app.use(makeErrorResponseHandler(logger));

  return app;
};
