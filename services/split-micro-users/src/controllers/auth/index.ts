import {returnAnonymouslyBasedOnSafeParseResult} from '../../lib/endpoint-util';
import logger from '../../logger';
import {makeMakeRegisterEndpoint} from './endpoints/register';
import {RegisterRequestBodySchema, RegisterRequestQuerySchema} from './schemas/register';
import {makeRegisterCallback} from './callbacks/register';
import {UserModel} from '../../models/users/User';
import {makeMakeLoginEndpoint} from './endpoints/login';
import {LoginRequestBodySchema, LoginRequestQuerySchema} from './schemas/login';
import {makeLoginCallback} from './callbacks/login';

export const registerHandler = makeMakeRegisterEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    RegisterRequestBodySchema,
    RegisterRequestQuerySchema,
    makeRegisterCallback(logger, UserModel),
);

export const loginHandler = makeMakeLoginEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    LoginRequestBodySchema,
    LoginRequestQuerySchema,
    makeLoginCallback(logger, UserModel),
);
