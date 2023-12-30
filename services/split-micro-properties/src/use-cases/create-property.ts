import {GenerateIdFunction} from '@split-common/split-auth';
import {AuthenticatedEndpointUseCase, HttpStatus, nullToUndefined} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity} from '../entities';
import {CreatePropertyRequestBody, CreatePropertyRequestParams, CreatePropertyRequestQuery} from '../schemas';

export const makeCreatePropertyUseCase = (
    logger: winston.Logger,
    PropertyEntity: PropertyEntity,
    generateId: GenerateIdFunction,
): AuthenticatedEndpointUseCase<
  CreatePropertyRequestBody,
  CreatePropertyRequestParams,
  CreatePropertyRequestQuery,
  PropertyDto> =>
  async (requestingUserEmail, body) => {
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

    return {status: (property) ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR, data: nullToUndefined(property)};
  };
