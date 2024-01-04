import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  TogglePropertyAdministratorStatusRequestBody,
  togglePropertyAdministratorStatusRequestBodySchema,
  TogglePropertyAdministratorStatusRequestHeaders,
  togglePropertyAdministratorStatusRequestHeadersSchema,
  TogglePropertyAdministratorStatusRequestParams,
  togglePropertyAdministratorStatusRequestParamsSchema,
  TogglePropertyAdministratorStatusRequestQuery,
  togglePropertyAdministratorStatusRequestQuerySchema,
} from '../schemas';

export const makeTogglePropertyAdministratorStatusHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    togglePropertyAdministratorStatusController: AuthenticatedController<
      TogglePropertyAdministratorStatusRequestBody,
      TogglePropertyAdministratorStatusRequestParams,
      TogglePropertyAdministratorStatusRequestQuery,
      TogglePropertyAdministratorStatusRequestHeaders,
      PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: togglePropertyAdministratorStatusController,
      bodyParseResult: togglePropertyAdministratorStatusRequestBodySchema.safeParse(req.body),
      paramsParseResult: togglePropertyAdministratorStatusRequestParamsSchema.safeParse(req.params),
      queryParseResult: togglePropertyAdministratorStatusRequestQuerySchema.safeParse(req.query),
      headersParseResult: togglePropertyAdministratorStatusRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
