import {makeGetTokenFromTokenHoldController} from './get-token-from-token-hold';
import {makeLoginController} from './login';
import {makeRegisterController} from './register';
import logger from '../logger';
import {authService, mailService, registerService, tokenHoldService, tokenService, userService} from '../services';

export const loginController = makeLoginController(
    logger,
    authService,
);

export const registerController = makeRegisterController(
    logger,
    userService,
    registerService,
    tokenService,
    mailService,
);

export const getTokenFromTokenHoldController = makeGetTokenFromTokenHoldController(
    logger,
    tokenHoldService,
);
