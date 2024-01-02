import {executeAnonymousController, executeAuthenticatedController} from '@split-common/split-http';

import {makeGetProfileHandler} from './get-profile';
import {makeGetTokenFromTokenHoldHandler} from './get-token-from-token-hold';
import {makeIndexHealthCheckHandler} from './index-health-check';
import {makeLoginHandler} from './login';
import {makeRegisterHandler} from './register';
import {
  getProfileController,
  getTokenFromTokenHoldController,
  indexHealthCheckController,
  loginController,
  registerController,
} from '../controllers';
import {handleUnhandledControllerError} from '../util';

export const loginHandler = makeLoginHandler(
    handleUnhandledControllerError,
    executeAnonymousController,
    loginController,
);

export const registerHandler = makeRegisterHandler(
    handleUnhandledControllerError,
    executeAnonymousController,
    registerController,
);

export const getTokenFromTokenHoldHandler = makeGetTokenFromTokenHoldHandler(
    handleUnhandledControllerError,
    executeAnonymousController,
    getTokenFromTokenHoldController,
);

export const indexHealthCheckHandler = makeIndexHealthCheckHandler(
    handleUnhandledControllerError,
    executeAnonymousController,
    indexHealthCheckController,
);

export const getProfileHandler = makeGetProfileHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    getProfileController,
);
