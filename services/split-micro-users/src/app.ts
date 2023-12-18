import {configurePassport} from '@split-common/split-auth';
import {DEFAULT_RATE_LIMIT_PER_WINDOW, DEFAULT_RATE_LIMIT_WINDOW_MS} from '@split-common/split-constants/dist/rate-limit';
import {configureExpressApp} from '@split-common/split-service-config';
import passport from 'passport';

import {environment} from './environment';
import logger from './logger';
import {TokenHoldModel, UserModel} from './models';
import routes from './routes';

configurePassport(
    passport,
    environment.GOOGLE_CLIENT_ID,
    environment.GOOGLE_CLIENT_SECRET,
    environment.GOOGLE_CALLBACK_URL,
    environment.JWT_SECRET,
    UserModel,
).then((configuredPassport) => {
  configuredPassport.initialize();
});

const app = configureExpressApp(
    logger,
    routes,
    'USERS',
    environment.JWT_SECRET,
    environment.FRONT_END_URL,
    passport,
    DEFAULT_RATE_LIMIT_WINDOW_MS,
    DEFAULT_RATE_LIMIT_PER_WINDOW,
    UserModel,
    TokenHoldModel,
);

export default app;
