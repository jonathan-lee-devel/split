import express, {Express, Router} from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import winston from 'winston';
import {makeLogResponseTime} from '@split-common/split-observability';
import {makeErrorResponseHandler, notFoundCallback} from '@split-common/split-http';
import {makeLoginSuccessTokenHoldCallback, TokenHoldModel, UserModel} from '@split-common/split-auth';

/**
 * Configure the Express application with specified middleware and routes.
 *
 * @param {winston.Logger} logger - The logger instance.
 * @param {Router} routes - The router instance containing all the routes.
 * @param {string} serviceName - The name of the service.
 * @param {string} jwtSecret - The secret key used for generating JWT.
 * @param {string} frontEndUrl - The URL of the frontend.
 * @param {passport.PassportStatic} [passport] - The passport instance for authentication (optional).
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
): Express => {
  const app: Express = express();

  app.use(helmet.hidePoweredBy());
  app.use(makeLogResponseTime(logger, serviceName));
  app.use(compression());
  app.use(cors({credentials: true, optionsSuccessStatus: 200, origin: frontEndUrl}));
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(routes);
  if (passport) {
    app.get('/users/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));
    app.get(
        '/users/auth/google/redirect',
        passport.authenticate('google', {
          failureRedirect: frontEndUrl,
          session: false,
        }),
      makeLoginSuccessTokenHoldCallback(
          logger,
          jwtSecret,
          frontEndUrl,
          TokenHoldModel,
          UserModel,
      ) as any,
    );
  }
  app.use(notFoundCallback);
  app.use(makeErrorResponseHandler(logger));

  return app;
};
