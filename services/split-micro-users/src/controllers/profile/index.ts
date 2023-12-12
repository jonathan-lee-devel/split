import {UserModel} from '@split-common/split-auth';
import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';

import {makeGetProfileCallback} from './callbacks/get-profile';
import {makeMakeGetProfileEndpoint} from './endpoints/get-profile';
import {GetProfileRequestBodySchema, GetProfileRequestQuerySchema} from './schemas/get-profile';
import logger from '../../logger';

export const getProfileHandler = makeMakeGetProfileEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetProfileRequestBodySchema,
    GetProfileRequestQuerySchema,
    makeGetProfileCallback(logger, UserModel),
);
