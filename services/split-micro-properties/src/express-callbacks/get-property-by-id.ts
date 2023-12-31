import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  GetPropertyByIdRequestBody,
  getPropertyByIdRequestBodySchema,
  GetPropertyByIdRequestHeaders,
  getPropertyByIdRequestHeadersSchema,
  GetPropertyByIdRequestParams,
  getPropertyByIdRequestParamsSchema,
  GetPropertyByIdRequestQuery,
  getPropertyByIdRequestQuerySchema,
} from '../schemas';

export const makeGetPropertyByIdHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    getPropertyByIdController: AuthenticatedController<
      GetPropertyByIdRequestBody,
      GetPropertyByIdRequestParams,
      GetPropertyByIdRequestQuery,
      GetPropertyByIdRequestHeaders,
      PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: getPropertyByIdController,
      bodyParseResult: getPropertyByIdRequestBodySchema.safeParse(req.body),
      paramsParseResult: getPropertyByIdRequestParamsSchema.safeParse(req.params),
      queryParseResult: getPropertyByIdRequestQuerySchema.safeParse(req.query),
      headersParseResult: getPropertyByIdRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError('getPropertyByIdController', err, res);
  }
};
