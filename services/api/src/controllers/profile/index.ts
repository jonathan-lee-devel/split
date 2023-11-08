import {makeMakeGetProfileEndpoint} from './endpoints/get-profile';
import {returnBasedOnAuthenticationAndSafeParseResult} from '../../lib/endpoint-util';
import {GetProfileRequestBodySchema, GetProfileRequestQuerySchema} from './schems/get-profile';
import {makeGetProfileCallback} from './callbacks/get-profile';
import {UserModel} from '../../models/users/User';
import logger from '../../logger';
import {defaultModelTransform} from '../../lib/model-transform/default-model-transform';

export const getProfileHandler = makeMakeGetProfileEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetProfileRequestBodySchema,
    GetProfileRequestQuerySchema,
    makeGetProfileCallback(logger, UserModel, defaultModelTransform),
);
