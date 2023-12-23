import {MailToSendMessage} from '@split-common/split-constants';
import {returnAnonymouslyBasedOnSafeParseResult} from '@split-common/split-http';

import {makeConfirmRegistrationCallback} from './callbacks/confirm-registration';
import {makeGetTokenFromTokenHoldCallback} from './callbacks/get-token-from-token-hold';
import {makeLoginCallback} from './callbacks/login';
import {makeRegisterUserCallback} from './callbacks/register-user';
import {makeMakeConfirmRegistrationEndpoint} from './endpoints/confirm-registration';
import {makeMakeGetTokenFromTokenHoldEndpoint} from './endpoints/get-token-from-token-hold';
import {makeMakeLoginEndpoint} from './endpoints/login';
import {makeMakeRegisterUserEndpoint} from './endpoints/register-user';
import {ConfirmRegistrationRequestBodySchema, ConfirmRegistrationRequestQuerySchema} from './schemas/confirm-registration';
import {GetTokenFromTokenHoldRequestBodySchema, GetTokenFromTokenHoldRequestQuerySchema} from './schemas/get-token-from-token-hold';
import {LoginRequestBodySchema, LoginRequestQuerySchema} from './schemas/login';
import {RegisterRequestBodySchema, RegisterRequestQuerySchema} from './schemas/register';
import {environment} from '../../environment';
import logger from '../../logger';
import {RegistrationVerificationTokenModel, TokenHoldModel, UserModel} from '../../models';
import {makeMailToSendRabbitMQConnection} from '../../rabbitmq';
import {encodePassword, generateRegistrationVerificationToken, handleExistingUser} from '../../util';

const rabbitMQConnection = makeMailToSendRabbitMQConnection<MailToSendMessage>(logger, environment.RABBITMQ_URL);

export const registerUserHandler = makeMakeRegisterUserEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    RegisterRequestBodySchema,
    RegisterRequestQuerySchema,
    makeRegisterUserCallback(
        logger,
        handleExistingUser,
        generateRegistrationVerificationToken,
        encodePassword,
        UserModel,
        rabbitMQConnection,
        environment,
    ),
);

export const confirmRegistrationHandler = makeMakeConfirmRegistrationEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    ConfirmRegistrationRequestBodySchema,
    ConfirmRegistrationRequestQuerySchema,
    makeConfirmRegistrationCallback(
        logger,
        UserModel,
        RegistrationVerificationTokenModel,
    ),
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
