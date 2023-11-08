import winston from 'winston';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {IndexHealthCheckRequestBody, IndexHealthCheckRequestQuery} from '../schemas/index-health-check';
import {HttpStatus} from '../../../lib/enums/HttpStatus';

export const makeIndexHealthCheckCallback = (
    logger: winston.Logger,
): AnonymousEndpointCallback<IndexHealthCheckRequestBody, IndexHealthCheckRequestQuery> => async (req, res) => {
  logger.silly(`Requested health check from ${req.ip}`);
  return res.status(HttpStatus.OK).send();
};
