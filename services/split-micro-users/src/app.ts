import passport from 'passport';
import {configurePassport} from '@split-common/split-auth';
import {configureExpressApp} from '@split-common/split-service-config';
import routes from './routes';
import {environment} from './environment';
import logger from './logger';

configurePassport(passport).then((configuredPassport) => {
  configuredPassport.initialize();
});

const app = configureExpressApp(logger, routes, environment.JWT_SECRET, environment.FRONT_END_URL, passport);

export default app;
