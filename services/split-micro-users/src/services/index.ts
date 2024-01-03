import {makeGenerateId} from '@split-common/split-auth';

import {makeAuthService} from './auth';
import {makeMailService} from './mail';
import {makePasswordService} from './password';
import {makeRegisterService} from './register';
import {makeTokenService} from './token';
import {makeTokenHoldService} from './token-hold';
import {makeUserService} from './user';
import {
  makeDefaultPasswordResetVerificationTokenDao,
  makeDefaultRegistrationVerificationTokenDao,
  makeDefaultTokenHoldDao,
  makeDefaultUserDao,
} from '../dao';
import {environment} from '../environment';
import logger from '../logger';
import {makeMailToSendRabbitMQConnection} from '../rabbitmq';

const defaultUserDao = makeDefaultUserDao();

const defaultRegistrationTokenDao = makeDefaultRegistrationVerificationTokenDao();

const defaultPasswordResetTokenDao = makeDefaultPasswordResetVerificationTokenDao();

const defaultTokenHoldDao = makeDefaultTokenHoldDao();

const generateId = makeGenerateId(logger);

const mailToSendRabbitMQPromise = makeMailToSendRabbitMQConnection(logger, environment.RABBITMQ_URL);

export const passwordService = makePasswordService();

export type PasswordService = typeof passwordService;

export const authService = makeAuthService(
    environment.JWT_SECRET,
    defaultUserDao,
);

export type AuthService = typeof authService;

export const registerService = makeRegisterService(
    logger,
    defaultUserDao,
    generateId,
    passwordService,
    defaultRegistrationTokenDao,
);

export type RegisterService = typeof registerService;

export const userService = makeUserService(
    logger,
    defaultUserDao,
    defaultRegistrationTokenDao,
    defaultPasswordResetTokenDao,
);

export type UserService = typeof userService;

export const tokenService = makeTokenService(
    defaultRegistrationTokenDao,
    defaultPasswordResetTokenDao,
    generateId,
);

export type TokenService = typeof tokenService;

export const mailService = makeMailService(
    mailToSendRabbitMQPromise,
    environment.FRONT_END_URL,
);

export type MailService = typeof mailService;

export const tokenHoldService = makeTokenHoldService(
    defaultTokenHoldDao,
);

export type TokenHoldService = typeof tokenHoldService;
