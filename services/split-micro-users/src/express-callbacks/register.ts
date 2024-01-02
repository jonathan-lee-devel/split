import path from 'node:path';

import {AnonymousController, ExecuteAnonymousControllerFunction, HandleUnhandledControllerErrorFunction} from '@split-common/split-http';
import {Request, Response} from 'express';

import {RegistrationStatusDto} from '../dtos';
import {
  RegisterRequestBody,
  registerRequestBodySchema,
  RegisterRequestHeaders,
  registerRequestHeadersSchema,
  RegisterRequestParams,
  registerRequestParamsSchema,
  RegisterRequestQuery,
  registerRequestQuerySchema,
} from '../schemas';

export const makeRegisterHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    registerController: AnonymousController<
      RegisterRequestBody,
      RegisterRequestParams,
      RegisterRequestQuery,
      RegisterRequestHeaders,
      RegistrationStatusDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: registerController,
      bodyParseResult: registerRequestBodySchema.safeParse(req.body),
      paramsParseResult: registerRequestParamsSchema.safeParse(req.params),
      queryParseResult: registerRequestQuerySchema.safeParse(req.query),
      headersParseResult: registerRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
