import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {CreateExpenseRequestBody, CreateExpenseRequestHeaders, CreateExpenseRequestParams, CreateExpenseRequestQuery} from '../schemas';
import {ExpenseService} from '../services';

export const makeCreateExpenseController = (
    logger: winston.Logger,
    expenseService: ExpenseService,
): AuthenticatedController<
  CreateExpenseRequestBody,
  CreateExpenseRequestParams,
  CreateExpenseRequestQuery,
  CreateExpenseRequestHeaders,
  any> => // TODO: Replace any
  async (requestingUserEmail, body, _params, _query, headers) => {
    const {propertyId, name, amount, currencyCode} = body;
    logger.info(`Request from <${requestingUserEmail}> to create expense with name: ${name}`);

    return await expenseService.createExpense(requestingUserEmail, headers.authorization, propertyId, name, amount, currencyCode);
  };
