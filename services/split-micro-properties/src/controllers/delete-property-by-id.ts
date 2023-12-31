import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity} from '../entities';
import {
  DeletePropertyByIdRequestBody,
  DeletePropertyByIdRequestHeaders,
  DeletePropertyByIdRequestParams,
  DeletePropertyByIdRequestQuery,
} from '../schemas';

export const makeDeletePropertyByIdController = (
    logger: winston.Logger,
    propertyEntity: PropertyEntity,
): AuthenticatedController<
  DeletePropertyByIdRequestBody,
  DeletePropertyByIdRequestParams,
  DeletePropertyByIdRequestQuery,
  DeletePropertyByIdRequestHeaders,
  PropertyDto> =>
  async (requestingUserEmail, _body, params) => {
    const {propertyId} = params;
    logger.info(`Request from <${requestingUserEmail}> to delete property with ID: ${propertyId}`);

    return await propertyEntity.deletePropertyById(requestingUserEmail, propertyId);
  };
