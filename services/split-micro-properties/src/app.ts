import {configurePassport} from '@split-common/split-auth';
import {configureExpressApp} from '@split-common/split-service-config';
import passport from 'passport';

import {environment} from './environment';
import logger from './logger';
import routes from './routes';

configurePassport(
    passport,
    environment.GOOGLE_CLIENT_ID,
    environment.GOOGLE_CLIENT_SECRET,
    environment.GOOGLE_CALLBACK_URL,
    environment.JWT_SECRET,
).then((configuredPassport) => {
  configuredPassport.initialize();
});

const app = configureExpressApp(
    logger,
    routes,
    'PROPERTIES',
    environment.JWT_SECRET,
    environment.FRONT_END_URL,
    passport,
);

export default app;
