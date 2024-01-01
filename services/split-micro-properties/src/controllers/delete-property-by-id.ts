import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {
  DeletePropertyByIdRequestBody,
  DeletePropertyByIdRequestHeaders,
  DeletePropertyByIdRequestParams,
  DeletePropertyByIdRequestQuery,
} from '../schemas';
import {PropertyService} from '../services';

export const makeDeletePropertyByIdController = (
    logger: winston.Logger,
    propertyService: PropertyService,
): AuthenticatedController<
  DeletePropertyByIdRequestBody,
  DeletePropertyByIdRequestParams,
  DeletePropertyByIdRequestQuery,
  DeletePropertyByIdRequestHeaders,
  PropertyDto> =>
  async (requestingUserEmail, _body, params) => {
    const {propertyId} = params;
    logger.info(`Request from <${requestingUserEmail}> to delete property with ID: ${propertyId}`);

    return await propertyService.deletePropertyById(requestingUserEmail, propertyId);
  };
