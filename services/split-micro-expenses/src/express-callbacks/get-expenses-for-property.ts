import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {ExpenseDto} from '../dtos';
import {
  GetExpensesForPropertyRequestBody,
  getExpensesForPropertyRequestBodySchema,
  GetExpensesForPropertyRequestHeaders,
  getExpensesForPropertyRequestHeadersSchema,
  GetExpensesForPropertyRequestParams,
  getExpensesForPropertyRequestParamsSchema,
  GetExpensesForPropertyRequestQuery,
  getExpensesForPropertyRequestQuerySchema,
} from '../schemas';

export const makeGetExpensesForPropertyHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    getExpensesForPropertyController: AuthenticatedController<
      GetExpensesForPropertyRequestBody,
      GetExpensesForPropertyRequestParams,
      GetExpensesForPropertyRequestQuery,
      GetExpensesForPropertyRequestHeaders,
      ExpenseDto[]>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: getExpensesForPropertyController,
      bodyParseResult: getExpensesForPropertyRequestBodySchema.safeParse(req.body),
      paramsParseResult: getExpensesForPropertyRequestParamsSchema.safeParse(req.params),
      queryParseResult: getExpensesForPropertyRequestQuerySchema.safeParse(req.query),
      headersParseResult: getExpensesForPropertyRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
