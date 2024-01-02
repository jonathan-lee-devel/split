import {returnAnonymouslyBasedOnSafeParseResult} from '@split-common/split-http';

import {makeConfirmRegistrationCallback} from './callbacks/confirm-registration';
import {makeMakeConfirmRegistrationEndpoint} from './endpoints/confirm-registration';
import {ConfirmRegistrationRequestBodySchema, ConfirmRegistrationRequestQuerySchema} from './schemas/confirm-registration';
import logger from '../../logger';
import {RegistrationVerificationTokenModel, UserModel} from '../../models';

export const confirmRegistrationHandler = makeMakeConfirmRegistrationEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    ConfirmRegistrationRequestBodySchema,
    ConfirmRegistrationRequestQuerySchema,
    makeConfirmRegistrationCallback(
        logger,
        UserModel,
        RegistrationVerificationTokenModel,
    ),
);
