import {makeGenerateId} from '@split-common/split-auth';

import {makeExpenseService} from './expense';
import logger from '../logger';

const generateId = makeGenerateId(logger);

export const expenseService = makeExpenseService(
    logger,
    {},
    {},
    generateId,
);

export type ExpenseService = typeof expenseService;
