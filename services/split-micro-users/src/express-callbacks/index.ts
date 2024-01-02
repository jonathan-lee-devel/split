import {executeAnonymousController, executeAuthenticatedController} from '@split-common/split-http';

import {makeGetProfileHandler} from './get-profile';
import {makeGetTokenFromTokenHoldHandler} from './get-token-from-token-hold';
import {makeLoginHandler} from './login';
import {makeRegisterHandler} from './register';
import {getProfileController, getTokenFromTokenHoldController, loginController, registerController} from '../controllers';
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

export const getProfileHandler = makeGetProfileHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    getProfileController,
);
