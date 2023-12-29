import {GenerateIdFunction} from '@split-common/split-auth';
import {AuthenticatedEndpointUseCase, HttpStatus} from '@split-common/split-http';
import winston from 'winston';

import {Property, PropertyEntity} from '../entities/PropertyEntity';
import {CreatePropertyRequestBody, CreatePropertyRequestQuery} from '../schemas/create-property';

export const makeCreatePropertyUseCase = (
    logger: winston.Logger,
    PropertyEntity: PropertyEntity,
    generateId: GenerateIdFunction,
): AuthenticatedEndpointUseCase<CreatePropertyRequestBody, CreatePropertyRequestQuery, Property> =>
  async (requestingUserEmail, body, query) => {
    const {name, tenantEmails} = body;
    logger.info(`Request from <${requestingUserEmail}> to create property with name ${name}`);

    const property = await PropertyEntity.createAndReturnTransformed({
      id: await generateId(),
      createdByEmail: requestingUserEmail,
      name,
      administratorEmails: [requestingUserEmail],
      tenantEmails,
      acceptedInvitationEmails: [requestingUserEmail],
    });

    return {status: (property) ? HttpStatus.CREATED: HttpStatus.INTERNAL_SERVER_ERROR, data: property};
  };
