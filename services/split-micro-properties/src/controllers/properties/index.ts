import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {makeMakeCreatePropertyEndpoint} from './endpoints/create-property';
import {CreatePropertyRequestBodySchema, CreatePropertyRequestQuerySchema} from './schemas/create-property';
import {makeCreatePropertyCallback} from './callbacks/create-property';
import logger from '../../logger';

export const createPropertyHandler = makeMakeCreatePropertyEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    CreatePropertyRequestBodySchema,
    CreatePropertyRequestQuerySchema,
    makeCreatePropertyCallback(logger),
);
