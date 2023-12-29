import {AnonymousEndpointUseCase, ExecuteAnonymousControllerFunction, HttpStatus} from '@split-common/split-http';
import {Request, Response} from 'express';
import winston from 'winston';

import {
  IndexHealthCheckRequestBody,
  indexHealthCheckRequestBodySchema,
  IndexHealthCheckRequestQuery,
  indexHealthCheckRequestQuerySchema,
} from '../schemas/index-health-check';

export const makeIndexHealthCheckController = (
    logger: winston.Logger,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      useCase: (async (body, query) => {
        return {status: HttpStatus.OK, data: undefined};
      }) as AnonymousEndpointUseCase<IndexHealthCheckRequestBody, IndexHealthCheckRequestQuery, undefined>,
      bodyParseResult: indexHealthCheckRequestBodySchema.safeParse(req.body),
      queryParseResult: indexHealthCheckRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    logger.error(`Unhandled error occurred during execution of index health check use case: ${err}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
