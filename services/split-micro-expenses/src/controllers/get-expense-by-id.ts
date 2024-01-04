import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {
  GetExpenseByIdRequestBody,
  GetExpenseByIdRequestHeaders,
  GetExpenseByIdRequestParams,
  GetExpenseByIdRequestQuery,
} from '../schemas';
import {ExpenseService} from '../services';

export const makeGetExpenseByIdController = (
    logger: winston.Logger,
    expenseService: ExpenseService,
): AuthenticatedController<
  GetExpenseByIdRequestBody,
  GetExpenseByIdRequestParams,
  GetExpenseByIdRequestQuery,
  GetExpenseByIdRequestHeaders,
  any> =>
  async (requestingUserEmail, _body, params, _query, headers) => {
    const {expenseId} = params;
    logger.info(`Request from <${requestingUserEmail}> to get expense with ID: ${expenseId}`);

    return await expenseService.getExpenseById(requestingUserEmail, headers.authorization, expenseId);
  };
