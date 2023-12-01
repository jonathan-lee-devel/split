import {TokenHoldModel, UserModel} from '@split/split-auth-config';
import {returnAnonymouslyBasedOnSafeParseResult} from '../../lib/endpoint-util';
import logger from '../../logger';
import {makeMakeRegisterEndpoint} from './endpoints/register';
import {RegisterRequestBodySchema, RegisterRequestQuerySchema} from './schemas/register';
import {makeRegisterCallback} from './callbacks/register';
import {makeMakeLoginEndpoint} from './endpoints/login';
import {LoginRequestBodySchema, LoginRequestQuerySchema} from './schemas/login';
import {makeLoginCallback} from './callbacks/login';
import {environment} from '../../environment';
import {makeMakeGetTokenFromTokenHoldEndpoint} from './endpoints/get-token-from-token-hold';
import {GetTokenFromTokenHoldRequestBodySchema, GetTokenFromTokenHoldRequestQuerySchema} from './schemas/get-token-from-token-hold';
import {makeGetTokenFromTokenHoldCallback} from './callbacks/get-token-from-token-hold';

export const registerHandler = makeMakeRegisterEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    RegisterRequestBodySchema,
    RegisterRequestQuerySchema,
    makeRegisterCallback(logger, UserModel),
);

export const loginHandler = makeMakeLoginEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    LoginRequestBodySchema,
    LoginRequestQuerySchema,
    makeLoginCallback(logger, environment, UserModel),
);

export const getTokenFromTokenHoldHandler = makeMakeGetTokenFromTokenHoldEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    GetTokenFromTokenHoldRequestBodySchema,
    GetTokenFromTokenHoldRequestQuerySchema,
    makeGetTokenFromTokenHoldCallback(TokenHoldModel),
);
