import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAnonymousControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {
  GetExpenseByIdRequestBody,
  getExpenseByIdRequestBodySchema,
  GetExpenseByIdRequestHeaders,
  getExpenseByIdRequestHeadersSchema,
  GetExpenseByIdRequestParams,
  getExpenseByIdRequestParamsSchema,
  GetExpenseByIdRequestQuery,
  getExpenseByIdRequestQuerySchema,
} from '../schemas';

export const makeGetExpenseByIdHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    getExpenseByIdController: AuthenticatedController<
      GetExpenseByIdRequestBody,
      GetExpenseByIdRequestParams,
      GetExpenseByIdRequestQuery,
      GetExpenseByIdRequestHeaders,
      any>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: getExpenseByIdController,
      bodyParseResult: getExpenseByIdRequestBodySchema.safeParse(req.body),
      paramsParseResult: getExpenseByIdRequestParamsSchema.safeParse(req.params),
      queryParseResult: getExpenseByIdRequestQuerySchema.safeParse(req.query),
      headersParseResult: getExpenseByIdRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
