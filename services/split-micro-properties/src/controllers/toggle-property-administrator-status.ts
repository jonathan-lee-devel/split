import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity} from '../entities';
import {
  TogglePropertyAdministratorStatusRequestBody,
  TogglePropertyAdministratorStatusRequestHeaders,
  TogglePropertyAdministratorStatusRequestParams,
  TogglePropertyAdministratorStatusRequestQuery,
} from '../schemas';

export const makeTogglePropertyAdministratorStatusController = (
    logger: winston.Logger,
    propertyEntity: PropertyEntity,
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

    return await propertyEntity.togglePropertyAdministratorStatus(requestingUserEmail, propertyId, emailToToggle);
  };
