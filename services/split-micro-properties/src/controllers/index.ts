import {makeAcceptTenantInvitationToPropertyController} from './accept-tenant-invitation-to-property';
import {makeCreatePropertyController} from './create-property';
import {makeDeletePropertyByIdController} from './delete-property-by-id';
import {makeGetPropertiesWhereInvolvedController} from './get-properties-where-involved';
import {makeIndexHealthCheckController} from './index-health-check';
import {makeTogglePropertyAdministratorStatusController} from './toggle-property-administrator-status';
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
