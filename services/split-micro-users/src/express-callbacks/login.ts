import path from 'node:path';

import {AnonymousController, ExecuteAnonymousControllerFunction, HandleUnhandledControllerErrorFunction} from '@split-common/split-http';
import {Request, Response} from 'express';

import {TokenResponseDto} from '../dtos';
import {
  LoginRequestBody,
  loginRequestBodySchema,
  LoginRequestHeaders,
  loginRequestHeadersSchema,
  LoginRequestParams,
  loginRequestParamsSchema,
  LoginRequestQuery,
  loginRequestQuerySchema,
} from '../schemas';

export const makeLoginHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    loginController: AnonymousController<
    LoginRequestBody,
    LoginRequestParams,
    LoginRequestQuery,
    LoginRequestHeaders,
    TokenResponseDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: loginController,
      bodyParseResult: loginRequestBodySchema.safeParse(req.body),
      paramsParseResult: loginRequestParamsSchema.safeParse(req.params),
      queryParseResult: loginRequestQuerySchema.safeParse(req.query),
      headersParseResult: loginRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
