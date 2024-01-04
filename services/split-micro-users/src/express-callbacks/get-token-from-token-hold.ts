import path from 'node:path';

import {AnonymousController, ExecuteAnonymousControllerFunction, HandleUnhandledControllerErrorFunction} from '@split-common/split-http';
import {Request, Response} from 'express';

import {TokenResponseDto} from '../dtos';
import {
  GetTokenFromTokenHoldRequestBody,
  getTokenFromTokenHoldRequestBodySchema,
  GetTokenFromTokenHoldRequestHeaders,
  getTokenFromTokenHoldRequestHeadersSchema,
  GetTokenFromTokenHoldRequestParams,
  getTokenFromTokenHoldRequestParamsSchema,
  GetTokenFromTokenHoldRequestQuery,
  getTokenFromTokenHoldRequestQuerySchema,
} from '../schemas';

export const makeGetTokenFromTokenHoldHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    getTokenFromTokenHoldController: AnonymousController<
      GetTokenFromTokenHoldRequestBody,
      GetTokenFromTokenHoldRequestParams,
      GetTokenFromTokenHoldRequestQuery,
      GetTokenFromTokenHoldRequestHeaders,
      TokenResponseDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: getTokenFromTokenHoldController,
      bodyParseResult: getTokenFromTokenHoldRequestBodySchema.safeParse(req.body),
      paramsParseResult: getTokenFromTokenHoldRequestParamsSchema.safeParse(req.params),
      queryParseResult: getTokenFromTokenHoldRequestQuerySchema.safeParse(req.query),
      headersParseResult: getTokenFromTokenHoldRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
