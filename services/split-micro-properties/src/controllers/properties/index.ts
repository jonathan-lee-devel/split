import {makeGenerateId} from '@split-common/split-auth';
import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeCreatePropertyCallback} from './callbacks/create-property';
import {makeGetPropertiesWhereInvolvedCallback} from './callbacks/get-properties-where-involved';
import {makeGetPropertyByIdCallback} from './callbacks/get-property-by-id';
import {makeMakeCreatePropertyEndpoint} from './endpoints/create-property';
import {makeMakeGetPropertiesWhereInvolvedEndpoint} from './endpoints/get-properties-where-involved';
import {makeMakeGetPropertyByIdEndpoint} from './endpoints/get-property-by-id';
import {CreatePropertyRequestBodySchema, CreatePropertyRequestQuerySchema} from './schemas/create-property';
import {
  GetPropertiesWhereInvolvedRequestBodySchema,
  GetPropertiesWhereInvolvedRequestQuerySchema,
} from './schemas/get-properties-where-involved';
import {GetPropertiesByIdRequestBodySchema, GetPropertyByIdRequestQuerySchema} from './schemas/get-property-by-id';
import logger from '../../logger';
import {PropertyModel} from '../../models';

export const createPropertyHandler = makeMakeCreatePropertyEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    CreatePropertyRequestBodySchema,
    CreatePropertyRequestQuerySchema,
    makeCreatePropertyCallback(logger, makeGenerateId(logger), PropertyModel, defaultModelTransform),
);

export const getPropertyByIdHandler = makeMakeGetPropertyByIdEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetPropertiesByIdRequestBodySchema,
    GetPropertyByIdRequestQuerySchema,
    makeGetPropertyByIdCallback(logger, PropertyModel, defaultModelTransform),
);

export const getPropertiesWhereInvolvedHandler = makeMakeGetPropertiesWhereInvolvedEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetPropertiesWhereInvolvedRequestBodySchema,
    GetPropertiesWhereInvolvedRequestQuerySchema,
    makeGetPropertiesWhereInvolvedCallback(logger, PropertyModel),
);
