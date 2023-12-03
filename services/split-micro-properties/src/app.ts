import passport from 'passport';
import {configureExpressApp} from '@split-common/split-service-config';
import {configurePassport} from '@split-common/split-auth';
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

const app = configureExpressApp(logger, routes, 'PROPERTIES', environment.JWT_SECRET, environment.FRONT_END_URL, passport);

export default app;
