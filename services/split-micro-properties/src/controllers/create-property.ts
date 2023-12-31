import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity} from '../entities';
import {CreatePropertyRequestBody, CreatePropertyRequestParams, CreatePropertyRequestQuery} from '../schemas';

export const makeCreatePropertyController = (
    logger: winston.Logger,
    propertyEntity: PropertyEntity,
): AuthenticatedController<
  CreatePropertyRequestBody,
  CreatePropertyRequestParams,
  CreatePropertyRequestQuery,
  PropertyDto> =>
  async (requestingUserEmail, body) => {
    const {name, tenantEmails} = body;
    logger.info(`Request from <${requestingUserEmail}> to create property with name ${name}`);

    return await propertyEntity.createNewProperty(requestingUserEmail, name, tenantEmails);
  };
