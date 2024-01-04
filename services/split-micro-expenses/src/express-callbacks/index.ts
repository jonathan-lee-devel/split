import {executeAuthenticatedController} from '@split-common/split-http';

import {makeCreateExpenseHandler} from './create-expense';
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
