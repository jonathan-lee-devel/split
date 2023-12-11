import winston from 'winston';
import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAnonymous} from '@split-common/split-http';
import {IndexHealthCheckRequestBody, IndexHealthCheckRequestQuery} from '../schemas/index-health-check';

export const makeIndexHealthCheckCallback = (
    logger: winston.Logger,
): AnonymousEndpointCallback<IndexHealthCheckRequestBody, IndexHealthCheckRequestQuery> =>
  wrapTryCatchAnonymous<IndexHealthCheckRequestBody, IndexHealthCheckRequestQuery>(async (req, res) => {
    logger.silly(`Requested health check from ${req.ip}`);
    return res.status(HttpStatus.OK).send();
  }) as any;
