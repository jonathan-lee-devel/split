import {executeAnonymousController} from '@split-common/split-http';

import {makeGetExpenseByIdHandler} from './login';
import {getExpenseByIdController} from '../controllers';
import {handleUnhandledControllerError} from '../util';

export const getExpenseByIdHandler = makeGetExpenseByIdHandler(
    handleUnhandledControllerError,
    executeAnonymousController,
    getExpenseByIdController,
);

