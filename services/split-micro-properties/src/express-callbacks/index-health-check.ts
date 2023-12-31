import {AnonymousController, ExecuteAnonymousControllerFunction, HandleUnhandledControllerErrorFunction} from '@split-common/split-http';
import {Request, Response} from 'express';

import {
  IndexHealthCheckRequestBody,
  indexHealthCheckRequestBodySchema,
  IndexHealthCheckRequestParams,
  indexHealthCheckRequestParamsSchema,
  IndexHealthCheckRequestQuery,
  indexHealthCheckRequestQuerySchema,
} from '../schemas';

export const makeIndexHealthCheckController = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    indexHealthCheckController: AnonymousController<
    IndexHealthCheckRequestBody,
    IndexHealthCheckRequestParams,
    IndexHealthCheckRequestQuery,
    never>,
) => async (req: Request, res: Response) => {
  try {
    await executeAnonymousController({
      req,
      res,
      controller: indexHealthCheckController,
      bodyParseResult: indexHealthCheckRequestBodySchema.safeParse(req.body),
      paramsParseResult: indexHealthCheckRequestParamsSchema.safeParse(req.params),
      queryParseResult: indexHealthCheckRequestQuerySchema.safeParse(req.query),
    });
  } catch (err) {
    handleUnhandledControllerError('indexHealthCheckController', err, res);
  }
};
