import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  CreatePropertyRequestBody,
  createPropertyRequestBodySchema,
  CreatePropertyRequestHeaders,
  createPropertyRequestHeadersSchema,
  CreatePropertyRequestParams,
  createPropertyRequestParamsSchema,
  CreatePropertyRequestQuery,
  createPropertyRequestQuerySchema,
} from '../schemas';

export const makeCreatePropertyHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    createPropertyController: AuthenticatedController<
      CreatePropertyRequestBody,
      CreatePropertyRequestParams,
      CreatePropertyRequestQuery,
      CreatePropertyRequestHeaders,
      PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: createPropertyController,
      bodyParseResult: createPropertyRequestBodySchema.safeParse(req.body),
      paramsParseResult: createPropertyRequestParamsSchema.safeParse(req.params),
      queryParseResult: createPropertyRequestQuerySchema.safeParse(req.query),
      headersParseResult: createPropertyRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
