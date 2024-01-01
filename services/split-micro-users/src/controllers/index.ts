import {makeLoginController} from './login';
import logger from '../logger';
import {authService} from '../services';

export const loginController = makeLoginController(
    logger,
    authService,
);
