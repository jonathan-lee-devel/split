import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {
  DeleteExpenseByIdRequestBody,
  DeleteExpenseByIdRequestHeaders,
  DeleteExpenseByIdRequestParams,
  DeleteExpenseByIdRequestQuery,
} from '../schemas';
import {ExpenseService} from '../services';

export const makeDeleteExpenseByIdController = (
    logger: winston.Logger,
    expenseService: ExpenseService,
): AuthenticatedController<
  DeleteExpenseByIdRequestBody,
  DeleteExpenseByIdRequestParams,
  DeleteExpenseByIdRequestQuery,
  DeleteExpenseByIdRequestHeaders,
  any> => // TODO: Replace any
  async (requestingUserEmail, _body, params, _query, headers) => {
    const {expenseId} = params;
    logger.info(`Request from <${requestingUserEmail}> to delete expense with ID: ${expenseId}`);

    return await expenseService.deleteExpenseById(requestingUserEmail, headers.authorization, expenseId);
  };
