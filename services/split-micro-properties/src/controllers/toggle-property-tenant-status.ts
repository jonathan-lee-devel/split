import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity} from '../entities';
import {
  TogglePropertyTenantStatusRequestBody,
  TogglePropertyTenantStatusRequestParams,
  TogglePropertyTenantStatusRequestQuery,
} from '../schemas';

export const makeTogglePropertyTenantStatusController = (
    logger: winston.Logger,
    propertyEntity: PropertyEntity,
): AuthenticatedController<
  TogglePropertyTenantStatusRequestBody,
  TogglePropertyTenantStatusRequestParams,
  TogglePropertyTenantStatusRequestQuery,
  PropertyDto> =>
  async (requestingUserEmail, body, params) => {
    const {emailToToggle} = body;
    const {propertyId} = params;
    logger.info(`Request from <${requestingUserEmail}> to toggle tenant status for email: <${emailToToggle}> for ID: ${propertyId}`);

    return await propertyEntity.togglePropertyTenantStatus(requestingUserEmail, propertyId, emailToToggle);
  };
