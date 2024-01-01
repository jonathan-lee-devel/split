import {makeAcceptTenantInvitationToPropertyController} from './accept-tenant-invitation-to-property';
import {makeCreatePropertyController} from './create-property';
import {makeDeletePropertyByIdController} from './delete-property-by-id';
import {makeGetPropertiesWhereInvolvedController} from './get-properties-where-involved';
import {makeGetPropertyByIdController} from './get-property-by-id';
import {makeIndexHealthCheckController} from './index-health-check';
import {makeInviteTenantToPropertyController} from './invite-tenant-to-property';
import {makeTogglePropertyAdministratorStatusController} from './toggle-property-administrator-status';
import {makeTogglePropertyTenantStatusController} from './toggle-property-tenant-status';
import logger from '../logger';
import {propertyInvitationTokenService, propertyService} from '../services';

export const indexHealthCheckController = makeIndexHealthCheckController();

export const createPropertyController = makeCreatePropertyController(
    logger,
    propertyService,
);

export const acceptTenantInvitationToPropertyController = makeAcceptTenantInvitationToPropertyController(
    logger,
    propertyInvitationTokenService,
);

export const deletePropertyByIdController = makeDeletePropertyByIdController(
    logger,
    propertyService,
);

export const getPropertiesWhereInvolvedController = makeGetPropertiesWhereInvolvedController(
    logger,
    propertyService,
);

export const togglePropertyAdministratorStatusController = makeTogglePropertyAdministratorStatusController(
    logger,
    propertyService,
);

export const togglePropertyTenantStatusController = makeTogglePropertyTenantStatusController(
    logger,
    propertyService,
);

export const getPropertyByIdController = makeGetPropertyByIdController(
    logger,
    propertyService,
);

export const inviteTenantToPropertyController = makeInviteTenantToPropertyController(
    logger,
    propertyService,
    propertyInvitationTokenService,
);
