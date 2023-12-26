import {makeGenerateId} from '@split-common/split-auth';
import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeCreateExpenseCallback} from './callbacks/create-expense';
import {makeGetExpenseByIdCallback} from './callbacks/get-expense-by-id';
import {makeMakeCreateExpenseEndpoint} from './endpoints/create-expense';
import {makeMakeGetExpenseByIdEndpoint} from './endpoints/get-expense-by-id';
import {CreateExpenseRequestBodySchema, CreateExpenseRequestQuerySchema} from './schemas/create-expense';
import {GetExpenseByIdRequestBodySchema, GetExpenseByIdRequestQuerySchema} from './schemas/get-expense-by-id';
import {environment} from '../../environment';
import logger from '../../logger';
import {ExpenseModel} from '../../models';
import {makeGetPropertyById} from '../../util/property/get-property-by-id';
import {getPropertiesServiceBaseUrlFromNodeEnv} from '../../util/property/get-property-service-base-url';

export const createExpenseHandler = makeMakeCreateExpenseEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    CreateExpenseRequestBodySchema,
    CreateExpenseRequestQuerySchema,
    makeCreateExpenseCallback(
        logger,
        makeGenerateId(logger),
        makeGetPropertyById(logger, getPropertiesServiceBaseUrlFromNodeEnv(environment.NODE_ENV)),
        ExpenseModel,
        defaultModelTransform,
    ),
);

export const getExpenseByIdHandler = makeMakeGetExpenseByIdEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetExpenseByIdRequestBodySchema,
    GetExpenseByIdRequestQuerySchema,
    makeGetExpenseByIdCallback(
        logger,
        ExpenseModel,
        makeGetPropertyById(logger, getPropertiesServiceBaseUrlFromNodeEnv(environment.NODE_ENV)),
        defaultModelTransform,
    ),
);
