import {makeGenerateId} from '@split-common/split-auth';
import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeCreateExpenseCallback} from './callbacks/create-expense';
import {makeDeleteExpenseByIdCallback} from './callbacks/delete-expense-by-id';
import {makeGetExpenseByIdCallback} from './callbacks/get-expense-by-id';
import {makeGetExpensesForPropertyCallback} from './callbacks/get-expenses-for-property';
import {makeMakeCreateExpenseEndpoint} from './endpoints/create-expense';
import {makeMakeDeleteExpenseByIdEndpoint} from './endpoints/delete-expense-by-id';
import {makeMakeGetExpenseByIdEndpoint} from './endpoints/get-expense-by-id';
import {makeMakeGetExpensesForPropertyEndpoint} from './endpoints/get-expenses-for-property';
import {CreateExpenseRequestBodySchema, CreateExpenseRequestQuerySchema} from './schemas/create-expense';
import {DeleteExpenseByIdRequestBodySchema, DeleteExpenseByIdRequestQuerySchema} from './schemas/delete-expense-by-id';
import {GetExpenseByIdRequestBodySchema, GetExpenseByIdRequestQuerySchema} from './schemas/get-expense-by-id';
import {GetExpensesForPropertyRequestBodySchema, GetExpensesForPropertyRequestQuerySchema} from './schemas/get-expenses-for-property';
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

export const deleteExpenseByIdHandler = makeMakeDeleteExpenseByIdEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    DeleteExpenseByIdRequestBodySchema,
    DeleteExpenseByIdRequestQuerySchema,
    makeDeleteExpenseByIdCallback(
        logger,
        ExpenseModel,
        makeGetPropertyById(logger, getPropertiesServiceBaseUrlFromNodeEnv(environment.NODE_ENV)),
        defaultModelTransform,
    ),
);

export const getExpensesForPropertyHandler = makeMakeGetExpensesForPropertyEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetExpensesForPropertyRequestBodySchema,
    GetExpensesForPropertyRequestQuerySchema,
    makeGetExpensesForPropertyCallback(
        logger,
        ExpenseModel,
        makeGetPropertyById(logger, getPropertiesServiceBaseUrlFromNodeEnv(environment.NODE_ENV)),
        defaultModelTransform,
    ),
);
