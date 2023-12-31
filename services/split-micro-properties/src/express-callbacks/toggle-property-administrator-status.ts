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
    });
  } catch (err) {
    handleUnhandledControllerError('togglePropertyAdministratorStatusController', err, res);
  }
};
