import {executeAuthenticatedController} from '@split-common/split-http';

import {makeCreateExpenseHandler} from './create-expense';
import {makeDeleteExpenseByIdHandler} from './delete-expense-by-id';
import {makeGetExpenseByIdHandler} from './get-expense-by-id';
import {createExpenseController, getExpenseByIdController} from '../controllers';
import {handleUnhandledControllerError} from '../util';

export const getExpenseByIdHandler = makeGetExpenseByIdHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    getExpenseByIdController,
);

export const createExpenseHandler = makeCreateExpenseHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    createExpenseController,
);

export const deleteExpenseByIdHandler = makeDeleteExpenseByIdHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    getExpenseByIdController,
);
