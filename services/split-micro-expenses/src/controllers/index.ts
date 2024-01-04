import {makeCreateExpenseController} from './create-expense';
import {makeDeleteExpenseByIdController} from './delete-expense-by-id';
import {makeGetExpenseByIdController} from './get-expense-by-id';
import {makeGetExpensesForPropertyController} from './get-expenses-for-property';
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

export const deleteExpenseByIdController = makeDeleteExpenseByIdController(
    logger,
    expenseService,
);

export const getExpensesForPropertyController = makeGetExpensesForPropertyController(
    logger,
    expenseService,
);
