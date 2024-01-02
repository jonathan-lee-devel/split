import {executeAnonymousController} from '@split-common/split-http';

import {makeGetTokenFromTokenHoldHandler} from './get-token-from-token-hold';
import {makeLoginHandler} from './login';
import {makeRegisterHandler} from './register';
import {getTokenFromTokenHoldController, loginController, registerController} from '../controllers';
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
