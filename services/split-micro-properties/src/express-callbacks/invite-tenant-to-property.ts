import path from 'node:path';

import {
  AuthenticatedController,
  ExecuteAuthenticatedControllerFunction,
  HandleUnhandledControllerErrorFunction,
} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  InviteTenantToPropertyRequestBody,
  inviteTenantToPropertyRequestBodySchema,
  InviteTenantToPropertyRequestHeaders,
  inviteTenantToPropertyRequestHeadersSchema,
  InviteTenantToPropertyRequestParams,
  inviteTenantToPropertyRequestParamsSchema,
  InviteTenantToPropertyRequestQuery,
  inviteTenantToPropertyRequestQuerySchema,
} from '../schemas';

export const makeInviteTenantToPropertyHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    inviteTenantToPropertyController: AuthenticatedController<
    InviteTenantToPropertyRequestBody,
    InviteTenantToPropertyRequestParams,
    InviteTenantToPropertyRequestQuery,
    InviteTenantToPropertyRequestHeaders,
    PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      controller: inviteTenantToPropertyController,
      bodyParseResult: inviteTenantToPropertyRequestBodySchema.safeParse(req.body),
      paramsParseResult: inviteTenantToPropertyRequestParamsSchema.safeParse(req.params),
      queryParseResult: inviteTenantToPropertyRequestQuerySchema.safeParse(req.query),
      headersParseResult: inviteTenantToPropertyRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
