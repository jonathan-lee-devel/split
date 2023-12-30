import {AnonymousEndpointUseCase, ExecuteAnonymousControllerFunction, HttpStatus} from '@split-common/split-http';
import {Request, Response} from 'express';
import winston from 'winston';

import {Property} from '../dao';
import {
  AcceptTenantInvitationToPropertyRequestBody,
  acceptTenantInvitationToPropertyRequestBodySchema,
  AcceptTenantInvitationToPropertyRequestParams,
  acceptTenantInvitationToPropertyRequestParamsSchema,
  AcceptTenantInvitationToPropertyRequestQuery,
  acceptTenantInvitationToPropertyRequestQuerySchema,
} from '../schemas';

export const makeAcceptTenantInvitationController = (
    logger: winston.Logger,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    acceptTenantInvitationUseCase: AnonymousEndpointUseCase<
    AcceptTenantInvitationToPropertyRequestBody,
    AcceptTenantInvitationToPropertyRequestParams,
    AcceptTenantInvitationToPropertyRequestQuery,
    Property>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      useCase: acceptTenantInvitationUseCase,
      bodyParseResult: acceptTenantInvitationToPropertyRequestBodySchema.safeParse(req.body),
      paramsParseResult: acceptTenantInvitationToPropertyRequestParamsSchema.safeParse(req.params),
      queryParseResult: acceptTenantInvitationToPropertyRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    logger.error(`Unhandled error occurred during execution of accept tenant invitation use case: ${err}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
