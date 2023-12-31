import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  TogglePropertyTenantStatusRequestBody,
  togglePropertyTenantStatusRequestBodySchema,
  TogglePropertyTenantStatusRequestParams,
  togglePropertyTenantStatusRequestParamsSchema,
  TogglePropertyTenantStatusRequestQuery,
  togglePropertyTenantStatusRequestQuerySchema,
} from '../schemas';

export const makeTogglePropertyTenantStatusHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    togglePropertyTenantStatusController: AuthenticatedController<
      TogglePropertyTenantStatusRequestBody,
      TogglePropertyTenantStatusRequestParams,
      TogglePropertyTenantStatusRequestQuery,
      PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: togglePropertyTenantStatusController,
      bodyParseResult: togglePropertyTenantStatusRequestBodySchema.safeParse(req.body),
      paramsParseResult: togglePropertyTenantStatusRequestParamsSchema.safeParse(req.params),
      queryParseResult: togglePropertyTenantStatusRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    handleUnhandledControllerError('togglePropertyTenantStatusController', err, res);
  }
};
