import {AuthenticatedEndpointUseCase} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity} from '../entities';
import {DeletePropertyByIdRequestBody, DeletePropertyByIdRequestParams, DeletePropertyByIdRequestQuery} from '../schemas';

export const makeDeletePropertyByIdUseCase = (
    logger: winston.Logger,
    propertyEntity: PropertyEntity,
): AuthenticatedEndpointUseCase<
  DeletePropertyByIdRequestBody,
  DeletePropertyByIdRequestParams,
  DeletePropertyByIdRequestQuery,
  PropertyDto> =>
  async (requestingUserEmail, _body, params) => {
    const {propertyId} = params;
    logger.info(`Request from <${requestingUserEmail}> to delete property with ID: ${propertyId}`);

    return await propertyEntity.deletePropertyById(requestingUserEmail, propertyId);
  };
