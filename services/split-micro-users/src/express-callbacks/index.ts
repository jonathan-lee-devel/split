import {executeAnonymousController} from '@split-common/split-http';

import {makeLoginHandler} from './login';
import {loginController} from '../controllers';
import {handleUnhandledControllerError} from '../util';

export const loginHandler = makeLoginHandler(
    handleUnhandledControllerError,
    executeAnonymousController,
    loginController,
);
