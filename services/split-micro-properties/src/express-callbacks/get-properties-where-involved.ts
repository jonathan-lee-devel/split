import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  GetPropertiesWhereInvolvedRequestBody,
  getPropertiesWhereInvolvedRequestBodySchema,
  GetPropertiesWhereInvolvedRequestHeaders,
  getPropertiesWhereInvolvedRequestHeadersSchema,
  GetPropertiesWhereInvolvedRequestParams,
  getPropertiesWhereInvolvedRequestParamsSchema,
  GetPropertiesWhereInvolvedRequestQuery,
  getPropertiesWhereInvolvedRequestQuerySchema,
} from '../schemas';

export const makeGetPropertiesWhereInvolvedHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    getPropertiesWhereInvolvedController: AuthenticatedController<
      GetPropertiesWhereInvolvedRequestBody,
      GetPropertiesWhereInvolvedRequestParams,
      GetPropertiesWhereInvolvedRequestQuery,
      GetPropertiesWhereInvolvedRequestHeaders,
      PropertyDto[]>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: getPropertiesWhereInvolvedController,
      bodyParseResult: getPropertiesWhereInvolvedRequestBodySchema.safeParse(req.body),
      paramsParseResult: getPropertiesWhereInvolvedRequestParamsSchema.safeParse(req.params),
      queryParseResult: getPropertiesWhereInvolvedRequestQuerySchema.safeParse(req.query),
      headersParseResult: getPropertiesWhereInvolvedRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
