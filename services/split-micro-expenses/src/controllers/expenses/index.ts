import {makeGenerateId} from '@split-common/split-auth';
import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeCreateExpenseCallback} from './callbacks/create-expense';
import {makeGetExpenseByIdCallback} from './callbacks/get-expense-by-id';
import {makeMakeCreateExpenseEndpoint} from './endpoints/create-expense';
import {makeMakeGetExpenseByIdEndpoint} from './endpoints/get-expense-by-id';
import {CreateExpenseRequestBodySchema, CreateExpenseRequestQuerySchema} from './schemas/create-expense';
import {GetExpenseByIdRequestBodySchema, GetExpenseByIdRequestQuerySchema} from './schemas/get-expense-by-id';
import logger from '../../logger';
import {ExpenseModel} from '../../models';

export const createExpenseHandler = makeMakeCreateExpenseEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    CreateExpenseRequestBodySchema,
    CreateExpenseRequestQuerySchema,
    makeCreateExpenseCallback(
        logger,
        makeGenerateId(logger),
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
        defaultModelTransform,
    ),
);
