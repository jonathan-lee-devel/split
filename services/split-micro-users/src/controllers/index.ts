import {makeConfirmPasswordResetController} from './confirm-password-reset';
import {makeConfirmRegistrationController} from './confirm-registration';
import {makeGetProfileController} from './get-profile';
import {makeGetTokenFromTokenHoldController} from './get-token-from-token-hold';
import {makeLoginController} from './login';
import {makeRegisterController} from './register';
import {makeResetPasswordController} from './reset-password';
import logger from '../logger';
import {authService, mailService, registerService, tokenHoldService, tokenService, userPasswordService, userService} from '../services';

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

export const getProfileController = makeGetProfileController(logger, userService);

export const confirmRegistrationController = makeConfirmRegistrationController(
    logger,
    registerService,
);

export const resetPasswordController = makeResetPasswordController(
    logger,
    userPasswordService,
);

export const confirmPasswordResetController = makeConfirmPasswordResetController(
    logger,
    userPasswordService,
);
