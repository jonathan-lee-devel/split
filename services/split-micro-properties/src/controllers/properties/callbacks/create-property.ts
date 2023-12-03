import winston from 'winston';
import {AuthenticatedEndpointCallback, HttpStatus} from '@split-common/split-http';
import {CreatePropertyRequestBody, CreatePropertyRequestQuery} from '../schemas/create-property';

export const makeCreatePropertyCallback = (
    logger: winston.Logger,
): AuthenticatedEndpointCallback<CreatePropertyRequestBody, CreatePropertyRequestQuery> => async (req, res) => {
  logger.info(`Request from ${req.user.email} to create property with name ${req.body.name}`);
  return res.status(HttpStatus.CREATED).json({...req.body});
};
