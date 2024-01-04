import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {ExpenseDto} from '../dtos';
import {
  GetExpensesForPropertyRequestBody,
  GetExpensesForPropertyRequestHeaders,
  GetExpensesForPropertyRequestParams,
  GetExpensesForPropertyRequestQuery,
} from '../schemas';
import {ExpenseService} from '../services';

export const makeGetExpensesForPropertyController = (
    logger: winston.Logger,
    expenseService: ExpenseService,
): AuthenticatedController<
  GetExpensesForPropertyRequestBody,
  GetExpensesForPropertyRequestParams,
  GetExpensesForPropertyRequestQuery,
  GetExpensesForPropertyRequestHeaders,
  ExpenseDto[]> =>
  async (requestingUserEmail, _body, params, _query, headers) => {
    const {propertyId} = params;
    logger.info(`Request from <${requestingUserEmail}> to get expenses for property with ID: ${propertyId}`);

    return await expenseService.getExpensesForProperty(requestingUserEmail, headers.authorization, propertyId);
  };
