import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity} from '../entities';
import {
  GetPropertiesWhereInvolvedRequestBody,
  GetPropertiesWhereInvolvedRequestParams,
  GetPropertiesWhereInvolvedRequestQuery,
} from '../schemas';

export const makeGetPropertiesWhereInvolvedController = (
    logger: winston.Logger,
    propertyEntity: PropertyEntity,
): AuthenticatedController<
  GetPropertiesWhereInvolvedRequestBody,
  GetPropertiesWhereInvolvedRequestParams,
  GetPropertiesWhereInvolvedRequestQuery,
  PropertyDto[]> =>
  async (requestingUserEmail) => {
    logger.info(`Request from <${requestingUserEmail}> to get properties where involved`);
    return await propertyEntity.getPropertiesWhereInvolved(requestingUserEmail);
  };
