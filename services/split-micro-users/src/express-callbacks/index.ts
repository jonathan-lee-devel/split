import {executeAnonymousController} from '@split-common/split-http';

import {makeLoginHandler} from './login';
import {makeRegisterHandler} from './register';
import {loginController, registerController} from '../controllers';
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
