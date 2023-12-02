import passport from 'passport';
import {configurePassport} from '@split-common/split-auth';
import {configureExpressApp} from '@split-common/split-service-config';
import routes from './routes';
import {environment} from './environment';
import logger from './logger';

configurePassport(passport).then((configuredPassport) => {
  configuredPassport.initialize();
});

const app = configureExpressApp(logger, environment, routes, passport);

export default app;
