import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import {environment} from './environment';
import {logResponseTime} from './lib/log-response-time';
import {errorResponseHandler} from './lib/error-response-handler';
import passport from 'passport';
import {notFoundCallback} from './lib/not-found-callback';
import {makeLoginSuccessTokenHold} from './lib/login-success-token-hold';
import {configurePassport, TokenHoldModel, UserModel} from '@split/split-auth-config';
import logger from './logger';

const app = express();

app.use(helmet.hidePoweredBy());
app.use(logResponseTime);
app.use(compression() as any);
app.use(cors({credentials: true, optionsSuccessStatus: 200, origin: environment.FRONT_END_URL}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const configuredPassport = configurePassport(logger, passport);
configuredPassport.initialize();
app.use(routes);
app.get('/users/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));
app.get('/users/auth/google/redirect', passport.authenticate('google', {
  failureRedirect: environment.FRONT_END_URL,
  session: false,
}),
// @ts-ignore
makeLoginSuccessTokenHold(
    environment,
    TokenHoldModel,
    UserModel),
);
app.use(notFoundCallback);
app.use(errorResponseHandler);

export default app;
