import {Request, Response} from 'express';

import {HandleUnhandledControllerErrorFunction} from '../../common-util';
import {AnonymousController, ExecuteAnonymousControllerFunction} from '../../endpoint-util';
import {
  IndexHealthCheckRequestBody,
  indexHealthCheckRequestBodySchema,
  IndexHealthCheckRequestHeaders,
  indexHealthCheckRequestHeadersSchema,
  IndexHealthCheckRequestParams,
  indexHealthCheckRequestParamsSchema,
  IndexHealthCheckRequestQuery,
  indexHealthCheckRequestQuerySchema,
} from '../schemas/index-health-check';

export const makeIndexHealthCheckHandler = (
    handleUnhandledControllerError: HandleUnhandledControllerErrorFunction,
    executeAnonymousController: ExecuteAnonymousControllerFunction,
    indexHealthCheckController: AnonymousController<
    IndexHealthCheckRequestBody,
    IndexHealthCheckRequestParams,
    IndexHealthCheckRequestQuery,
    IndexHealthCheckRequestHeaders,
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
      headersParseResult: indexHealthCheckRequestHeadersSchema.safeParse(req.headers),
    });
  } catch (err) {
    handleUnhandledControllerError('indexHealthCheckController', err, res);
  }
};
