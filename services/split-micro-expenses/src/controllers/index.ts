import {makeCreateExpenseController} from './create-expense';
import {makeGetExpenseByIdController} from './get-expense-by-id';
import logger from '../logger';
import {expenseService} from '../services';

export const getExpenseByIdController = makeGetExpenseByIdController(
    logger,
    expenseService,
);

export const createExpenseController = makeCreateExpenseController(
    logger,
    expenseService,
);
