import path from 'node:path';

import {AnonymousController, ExecuteAnonymousControllerFunction, HandleUnhandledControllerErrorFunction} from '@split-common/split-http';
import {Request, Response} from 'express';

import {PropertyDto} from '../dtos';
import {
  AcceptTenantInvitationToPropertyRequestBody,
  acceptTenantInvitationToPropertyRequestBodySchema,
  AcceptTenantInvitationToPropertyRequestHeaders,
  acceptTenantInvitationToPropertyRequestHeadersSchema,
  AcceptTenantInvitationToPropertyRequestParams,
  acceptTenantInvitationToPropertyRequestParamsSchema,
  AcceptTenantInvitationToPropertyRequestQuery,
  acceptTenantInvitationToPropertyRequestQuerySchema,
} from '../schemas';

export const makeAcceptTenantInvitationHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    acceptTenantInvitationController: AnonymousController<
    AcceptTenantInvitationToPropertyRequestBody,
    AcceptTenantInvitationToPropertyRequestParams,
    AcceptTenantInvitationToPropertyRequestQuery,
    AcceptTenantInvitationToPropertyRequestHeaders,
    PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: acceptTenantInvitationController,
      bodyParseResult: acceptTenantInvitationToPropertyRequestBodySchema.safeParse(req.body),
      paramsParseResult: acceptTenantInvitationToPropertyRequestParamsSchema.safeParse(req.params),
      queryParseResult: acceptTenantInvitationToPropertyRequestQuerySchema.safeParse(req.query),
      headersParseResult: acceptTenantInvitationToPropertyRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError(path.basename(__filename), err, res);
  }
};
