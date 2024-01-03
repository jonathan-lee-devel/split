import path from 'node:path';

import {AnonymousController, ExecuteAnonymousControllerFunction, HandleUnhandledControllerErrorFunction} from '@split-common/split-http';
import {Request, Response} from 'express';

import {SimpleStatusDto} from '../dtos';
import {
  ResetPasswordRequestBody,
  resetPasswordRequestBodySchema,
  ResetPasswordRequestHeaders,
  resetPasswordRequestHeadersSchema,
  ResetPasswordRequestParams,
  resetPasswordRequestParamsSchema,
  ResetPasswordRequestQuery,
  resetPasswordRequestQuerySchema,
} from '../schemas';

export const makeResetPasswordHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    resetPasswordController: AnonymousController<
      ResetPasswordRequestBody,
      ResetPasswordRequestParams,
      ResetPasswordRequestQuery,
      ResetPasswordRequestHeaders,
      SimpleStatusDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: resetPasswordController,
      bodyParseResult: resetPasswordRequestBodySchema.safeParse(req.body),
      paramsParseResult: resetPasswordRequestParamsSchema.safeParse(req.params),
      queryParseResult: resetPasswordRequestQuerySchema.safeParse(req.query),
      headersParseResult: resetPasswordRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
