import {AuthenticatedEndpointUseCase, ExecuteAuthenticatedControllerFunction, HttpStatus} from '@split-common/split-http';
import {Request, Response} from 'express';
import winston from 'winston';

import {Property} from '../entities';
import {
  CreatePropertyRequestBody,
  createPropertyRequestBodySchema,
  CreatePropertyRequestParams,
  createPropertyRequestParamsSchema,
  CreatePropertyRequestQuery,
  createPropertyRequestQuerySchema,
} from '../schemas';

export const makeCreatePropertyController = (
    logger: winston.Logger,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    createPropertyUseCase: AuthenticatedEndpointUseCase<
      CreatePropertyRequestBody,
      CreatePropertyRequestParams,
      CreatePropertyRequestQuery,
      Property>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      useCase: createPropertyUseCase,
      bodyParseResult: createPropertyRequestBodySchema.safeParse(req.body),
      paramsParseResult: createPropertyRequestParamsSchema.safeParse(req.params),
      queryParseResult: createPropertyRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    logger.error(`Unhandled error occurred during execution of create property use case: ${err}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
