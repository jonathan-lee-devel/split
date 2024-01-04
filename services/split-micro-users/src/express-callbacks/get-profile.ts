import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {UserProfileDto} from '../dtos';
import {
  GetProfileRequestBody,
  getProfileRequestBodySchema,
  GetProfileRequestHeaders,
  getProfileRequestHeadersSchema,
  GetProfileRequestParams,
  getProfileRequestParamsSchema,
  GetProfileRequestQuery,
  getProfileRequestQuerySchema,
} from '../schemas';

export const makeGetProfileHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    getProfileController: AuthenticatedController<
      GetProfileRequestBody,
      GetProfileRequestParams,
      GetProfileRequestQuery,
      GetProfileRequestHeaders,
      UserProfileDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: getProfileController,
      bodyParseResult: getProfileRequestBodySchema.safeParse(req.body),
      paramsParseResult: getProfileRequestParamsSchema.safeParse(req.params),
      queryParseResult: getProfileRequestQuerySchema.safeParse(req.query),
      headersParseResult: getProfileRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
