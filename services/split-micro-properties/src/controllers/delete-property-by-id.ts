import {AuthenticatedEndpointUseCase, ExecuteAuthenticatedControllerFunction, HttpStatus} from '@split-common/split-http';
import {Request, Response} from 'express';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {
  DeletePropertyByIdRequestBody,
  deletePropertyByIdRequestBodySchema,
  DeletePropertyByIdRequestParams,
  deletePropertyByIdRequestParamsSchema,
  DeletePropertyByIdRequestQuery,
  deletePropertyByIdRequestQuerySchema,
} from '../schemas';

export const makeDeletePropertyByIdController = (
    logger: winston.Logger,
    executeAuthenticatedController: ExecuteAuthenticatedControllerFunction,
    deletePropertyByIdUseCase: AuthenticatedEndpointUseCase<
    DeletePropertyByIdRequestBody,
    DeletePropertyByIdRequestParams,
    DeletePropertyByIdRequestQuery,
    PropertyDto>,
) => async (req: Request, res: Response) => {
  try {
    await executeAuthenticatedController({
      req,
      res,
      useCase: deletePropertyByIdUseCase,
      bodyParseResult: deletePropertyByIdRequestBodySchema.safeParse(req.body),
      paramsParseResult: deletePropertyByIdRequestParamsSchema.safeParse(req.params),
      queryParseResult: deletePropertyByIdRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    logger.error(`Unhandled error occurred during execution of delete property by ID use case: ${err}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
