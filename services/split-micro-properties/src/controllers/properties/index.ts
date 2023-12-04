import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {makeGenerateId} from '@split-common/split-auth';
import {defaultModelTransform} from '@split-common/split-service-config';
import logger from '../../logger';
import {makeMakeCreatePropertyEndpoint} from './endpoints/create-property';
import {CreatePropertyRequestBodySchema, CreatePropertyRequestQuerySchema} from './schemas/create-property';
import {makeCreatePropertyCallback} from './callbacks/create-property';
import {PropertyModel} from '../../models';

export const createPropertyHandler = makeMakeCreatePropertyEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    CreatePropertyRequestBodySchema,
    CreatePropertyRequestQuerySchema,
    makeCreatePropertyCallback(logger, makeGenerateId(logger), PropertyModel, defaultModelTransform),
);
