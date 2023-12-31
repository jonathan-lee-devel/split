import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {
  GetPropertiesWhereInvolvedRequestBody,
  GetPropertiesWhereInvolvedRequestHeaders,
  GetPropertiesWhereInvolvedRequestParams,
  GetPropertiesWhereInvolvedRequestQuery,
} from '../schemas';
import {PropertyService} from '../services';

export const makeGetPropertiesWhereInvolvedController = (
    logger: winston.Logger,
    propertyService: PropertyService,
): AuthenticatedController<
  GetPropertiesWhereInvolvedRequestBody,
  GetPropertiesWhereInvolvedRequestParams,
  GetPropertiesWhereInvolvedRequestQuery,
  GetPropertiesWhereInvolvedRequestHeaders,
  PropertyDto[]> =>
  async (requestingUserEmail) => {
    logger.info(`Request from <${requestingUserEmail}> to get properties where involved`);
    return await propertyService.getPropertiesWhereInvolved(requestingUserEmail);
  };
