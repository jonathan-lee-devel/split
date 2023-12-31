import {makeAcceptTenantInvitationToPropertyController} from './accept-tenant-invitation-to-property';
import {makeCreatePropertyController} from './create-property';
import {makeDeletePropertyByIdController} from './delete-property-by-id';
import {makeGetPropertiesWhereInvolvedController} from './get-properties-where-involved';
import {makeGetPropertyByIdController} from './get-property-by-id';
import {makeIndexHealthCheckController} from './index-health-check';
import {makeInviteTenantToPropertyController} from './invite-tenant-to-property';
import {makeTogglePropertyAdministratorStatusController} from './toggle-property-administrator-status';
import {makeTogglePropertyTenantStatusController} from './toggle-property-tenant-status';
import {propertyEntity, propertyInvitationTokenEntity} from '../entities';
import logger from '../logger';

export const indexHealthCheckController = makeIndexHealthCheckController();

export const createPropertyController = makeCreatePropertyController(
    logger,
    propertyEntity,
);

export const acceptTenantInvitationToPropertyController = makeAcceptTenantInvitationToPropertyController(
    logger,
    propertyInvitationTokenEntity,
);

export const deletePropertyByIdController = makeDeletePropertyByIdController(
    logger,
    propertyEntity,
);

export const getPropertiesWhereInvolvedController = makeGetPropertiesWhereInvolvedController(
    logger,
    propertyEntity,
);

export const togglePropertyAdministratorStatusController = makeTogglePropertyAdministratorStatusController(
    logger,
    propertyEntity,
);

export const togglePropertyTenantStatusController = makeTogglePropertyTenantStatusController(
    logger,
    propertyEntity,
);

export const getPropertyByIdController = makeGetPropertyByIdController(
    logger,
    propertyEntity,
);

export const inviteTenantToPropertyController = makeInviteTenantToPropertyController(
    logger,
    propertyEntity,
    propertyInvitationTokenEntity,
);
