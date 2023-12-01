import passport from 'passport';
import {configureExpressApp} from '@split/split-service-config';
import {configurePassport} from '@split/split-auth-config';
import routes from './routes';
import {environment} from './environment';
import logger from './logger';

configurePassport(passport).then((configuredPassport) => {
  configuredPassport.initialize();
});

const app = configureExpressApp(logger, environment, routes, passport);

export default app;
