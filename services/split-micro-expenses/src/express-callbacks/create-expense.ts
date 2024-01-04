import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {
  CreateExpenseRequestBody,
  createExpenseRequestBodySchema,
  CreateExpenseRequestHeaders,
  createExpenseRequestHeadersSchema,
  CreateExpenseRequestParams,
  createExpenseRequestParamsSchema,
  CreateExpenseRequestQuery,
  createExpenseRequestQuerySchema,
} from '../schemas';

export const makeCreateExpenseHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    createExpenseController: AuthenticatedController<
      CreateExpenseRequestBody,
      CreateExpenseRequestParams,
      CreateExpenseRequestQuery,
      CreateExpenseRequestHeaders,
      any>, // TODO: Replace any
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: createExpenseController,
      bodyParseResult: createExpenseRequestBodySchema.safeParse(req.body),
      paramsParseResult: createExpenseRequestParamsSchema.safeParse(req.params),
      queryParseResult: createExpenseRequestQuerySchema.safeParse(req.query),
      headersParseResult: createExpenseRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
