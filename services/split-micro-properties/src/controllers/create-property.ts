import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {CreatePropertyRequestBody, CreatePropertyRequestHeaders, CreatePropertyRequestParams, CreatePropertyRequestQuery} from '../schemas';
import {PropertyService} from '../services';

export const makeCreatePropertyController = (
    logger: winston.Logger,
    propertyService: PropertyService,
): AuthenticatedController<
  CreatePropertyRequestBody,
  CreatePropertyRequestParams,
  CreatePropertyRequestQuery,
  CreatePropertyRequestHeaders,
  PropertyDto> =>
  async (requestingUserEmail, body) => {
    const {name, tenantEmails} = body;
    logger.info(`Request from <${requestingUserEmail}> to create property with name ${name}`);

    return await propertyService.createNewProperty(requestingUserEmail, name, tenantEmails);
  };
