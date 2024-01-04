import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {
  DeleteExpenseByIdRequestBody,
  deleteExpenseByIdRequestBodySchema,
  DeleteExpenseByIdRequestHeaders,
  deleteExpenseByIdRequestHeadersSchema,
  DeleteExpenseByIdRequestParams,
  deleteExpenseByIdRequestParamsSchema,
  DeleteExpenseByIdRequestQuery,
  deleteExpenseByIdRequestQuerySchema,
} from '../schemas';

export const makeDeleteExpenseByIdHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    getExpenseByIdController: AuthenticatedController<
      DeleteExpenseByIdRequestBody,
      DeleteExpenseByIdRequestParams,
      DeleteExpenseByIdRequestQuery,
      DeleteExpenseByIdRequestHeaders,
      any>, // TODO: Replace any
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: getExpenseByIdController,
      bodyParseResult: deleteExpenseByIdRequestBodySchema.safeParse(req.body),
      paramsParseResult: deleteExpenseByIdRequestParamsSchema.safeParse(req.params),
      queryParseResult: deleteExpenseByIdRequestQuerySchema.safeParse(req.query),
      headersParseResult: deleteExpenseByIdRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
