import passport from 'passport';
import {configurePassport} from '@split-common/split-auth';
import {configureExpressApp} from '@split-common/split-service-config';
import routes from './routes';
import {environment} from './environment';
import logger from './logger';

configurePassport(
    passport,
    environment.GOOGLE_CLIENT_ID,
    environment.GOOGLE_CLIENT_SECRET,
    environment.GOOGLE_CALLBACK_URL,
    environment.JWT_SECRET,
).then((configuredPassport) => {
  configuredPassport.initialize();
});

const app = configureExpressApp(logger, routes, 'USERS', environment.JWT_SECRET, environment.FRONT_END_URL, passport);

export default app;
