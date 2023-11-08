import passport from 'passport';
import {makeMakeLoginEndpoint} from './endpoints/login';
import {returnAnonymouslyBasedOnSafeParseResult, returnBasedOnAuthenticationAndSafeParseResult} from '../../lib/endpoint-util';
import {LoginRequestBodySchema, LoginRequestQuerySchema} from './schemas/login';
import {makeLoginCallback} from './callbacks/login';
import logger from '../../logger';
import {makeMakeLogoutEndpoint} from './endpoints/logout';
import {LogoutRequestBodySchema, LogoutRequestQuerySchema} from './schemas/logout';
import {makeLogoutCallback} from './callbacks/logout';

export const loginHandler = makeMakeLoginEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    LoginRequestBodySchema,
    LoginRequestQuerySchema,
    makeLoginCallback(passport, logger),
);

export const logoutHandler = makeMakeLogoutEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    LogoutRequestBodySchema,
    LogoutRequestQuerySchema,
    makeLogoutCallback(logger),
);
