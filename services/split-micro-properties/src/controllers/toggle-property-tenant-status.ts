import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {
  TogglePropertyTenantStatusRequestBody,
  TogglePropertyTenantStatusRequestHeaders,
  TogglePropertyTenantStatusRequestParams,
  TogglePropertyTenantStatusRequestQuery,
} from '../schemas';
import {PropertyService} from '../services';

export const makeTogglePropertyTenantStatusController = (
    logger: winston.Logger,
    propertyService: PropertyService,
): AuthenticatedController<
  TogglePropertyTenantStatusRequestBody,
  TogglePropertyTenantStatusRequestParams,
  TogglePropertyTenantStatusRequestQuery,
  TogglePropertyTenantStatusRequestHeaders,
  PropertyDto> =>
  async (requestingUserEmail, body, params) => {
    const {emailToToggle} = body;
    const {propertyId} = params;
    logger.info(`Request from <${requestingUserEmail}> to toggle tenant status for email: <${emailToToggle}> for ID: ${propertyId}`);

    return await propertyService.togglePropertyTenantStatus(requestingUserEmail, propertyId, emailToToggle);
  };
