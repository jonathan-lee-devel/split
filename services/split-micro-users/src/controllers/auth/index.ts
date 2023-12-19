import {returnAnonymouslyBasedOnSafeParseResult} from '@split-common/split-http';

import {makeGetTokenFromTokenHoldCallback} from './callbacks/get-token-from-token-hold';
import {makeLoginCallback} from './callbacks/login';
import {makeRegisterCallback} from './callbacks/register';
import {makeMakeGetTokenFromTokenHoldEndpoint} from './endpoints/get-token-from-token-hold';
import {makeMakeLoginEndpoint} from './endpoints/login';
import {makeMakeRegisterEndpoint} from './endpoints/register';
import {GetTokenFromTokenHoldRequestBodySchema, GetTokenFromTokenHoldRequestQuerySchema} from './schemas/get-token-from-token-hold';
import {LoginRequestBodySchema, LoginRequestQuerySchema} from './schemas/login';
import {RegisterRequestBodySchema, RegisterRequestQuerySchema} from './schemas/register';
import {environment} from '../../environment';
import logger from '../../logger';
import {TokenHoldModel, UserModel} from '../../models';
import {makeRabbitMQConnection} from '../../rabbitmq';

const rabbitMQConnection = makeRabbitMQConnection(logger, environment.RABBITMQ_URL);

export const registerHandler = makeMakeRegisterEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    RegisterRequestBodySchema,
    RegisterRequestQuerySchema,
    makeRegisterCallback(logger, UserModel, rabbitMQConnection),
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
