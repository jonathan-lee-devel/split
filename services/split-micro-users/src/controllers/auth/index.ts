import {returnAnonymouslyBasedOnSafeParseResult} from '@split-common/split-http';

import {makeConfirmRegistrationCallback} from './callbacks/confirm-registration';
import {makeGetTokenFromTokenHoldCallback} from './callbacks/get-token-from-token-hold';
import {makeMakeConfirmRegistrationEndpoint} from './endpoints/confirm-registration';
import {makeMakeGetTokenFromTokenHoldEndpoint} from './endpoints/get-token-from-token-hold';
import {ConfirmRegistrationRequestBodySchema, ConfirmRegistrationRequestQuerySchema} from './schemas/confirm-registration';
import {GetTokenFromTokenHoldRequestBodySchema, GetTokenFromTokenHoldRequestQuerySchema} from './schemas/get-token-from-token-hold';
import logger from '../../logger';
import {RegistrationVerificationTokenModel, TokenHoldModel, UserModel} from '../../models';

export const confirmRegistrationHandler = makeMakeConfirmRegistrationEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    ConfirmRegistrationRequestBodySchema,
    ConfirmRegistrationRequestQuerySchema,
    makeConfirmRegistrationCallback(
        logger,
        UserModel,
        RegistrationVerificationTokenModel,
    ),
);

export const getTokenFromTokenHoldHandler = makeMakeGetTokenFromTokenHoldEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    GetTokenFromTokenHoldRequestBodySchema,
    GetTokenFromTokenHoldRequestQuerySchema,
    makeGetTokenFromTokenHoldCallback(TokenHoldModel),
);
