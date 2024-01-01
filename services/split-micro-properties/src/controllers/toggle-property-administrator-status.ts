import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {
  TogglePropertyAdministratorStatusRequestBody,
  TogglePropertyAdministratorStatusRequestHeaders,
  TogglePropertyAdministratorStatusRequestParams,
  TogglePropertyAdministratorStatusRequestQuery,
} from '../schemas';
import {PropertyService} from '../services';

export const makeTogglePropertyAdministratorStatusController = (
    logger: winston.Logger,
    propertyService: PropertyService,
): AuthenticatedController<
  TogglePropertyAdministratorStatusRequestBody,
  TogglePropertyAdministratorStatusRequestParams,
  TogglePropertyAdministratorStatusRequestQuery,
  TogglePropertyAdministratorStatusRequestHeaders,
  PropertyDto> =>
  async (requestingUserEmail, body, params) => {
    const {emailToToggle} = body;
    const {propertyId} = params;
    logger.info(`Request from <${requestingUserEmail}> to toggle administrator status for email: <${emailToToggle}> for ID: ${propertyId}`);

    return await propertyService.togglePropertyAdministratorStatus(requestingUserEmail, propertyId, emailToToggle);
  };
