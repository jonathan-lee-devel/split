import {UserModel} from '@split/split-auth-config';
import {returnBasedOnAuthenticationAndSafeParseResult} from '../../lib/endpoint-util';
import logger from '../../logger';
import {makeGetProfileCallback} from './callbacks/get-profile';
import {makeMakeGetProfileEndpoint} from './endpoints/get-profile';
import {GetProfileRequestBodySchema, GetProfileRequestQuerySchema} from './schemas/get-profile';

export const getProfileHandler = makeMakeGetProfileEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetProfileRequestBodySchema,
    GetProfileRequestQuerySchema,
    makeGetProfileCallback(logger, UserModel),
);
