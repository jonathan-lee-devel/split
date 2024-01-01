import {MICRO_COMMUNICATIONS_REQUEST_HEADER_NAME} from '@split-common/split-constants';
import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {
  GetPropertyByIdRequestBody,
  GetPropertyByIdRequestHeaders,
  GetPropertyByIdRequestParams,
  GetPropertyByIdRequestQuery,
} from '../schemas';
import {PropertyService} from '../services';

export const makeGetPropertyByIdController = (
    logger: winston.Logger,
    propertyService: PropertyService,
): AuthenticatedController<
  GetPropertyByIdRequestBody,
  GetPropertyByIdRequestParams,
  GetPropertyByIdRequestQuery,
  GetPropertyByIdRequestHeaders,
  PropertyDto> =>
  async (requestingUserEmail, _body, params, _query, headers) => {
    const {propertyId} = params;
    const viaMessage = (headers[MICRO_COMMUNICATIONS_REQUEST_HEADER_NAME]) ?
      `via: ${headers[MICRO_COMMUNICATIONS_REQUEST_HEADER_NAME]}` :
      '';
    logger.info(`Request from <${requestingUserEmail}> ${viaMessage} to get property with ID: ${propertyId}`);
    return await propertyService.getPropertyById(requestingUserEmail, propertyId);
  };
