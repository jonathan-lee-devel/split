import {executeAnonymousController, executeAuthenticatedController} from '@split-common/split-http';

import {makeAcceptTenantInvitationHandler} from './accept-tenant-invitation';
import {makeCreatePropertyHandler} from './create-property';
import {makeDeletePropertyByIdHandler} from './delete-property-by-id';
import {makeGetPropertiesWhereInvolvedHandler} from './get-properties-where-involved';
import {makeGetPropertyByIdHandler} from './get-property-by-id';
import {makeIndexHealthCheckHandler} from './index-health-check';
import {makeInviteTenantToPropertyHandler} from './invite-tenant-to-property';
import {makeTogglePropertyAdministratorStatusHandler} from './toggle-property-administrator-status';
import {makeTogglePropertyTenantStatusHandler} from './toggle-property-tenant-status';
import {
  acceptTenantInvitationToPropertyController,
  createPropertyController,
  deletePropertyByIdController,
  getPropertiesWhereInvolvedController,
  getPropertyByIdController,
  indexHealthCheckController,
  inviteTenantToPropertyController,
  togglePropertyAdministratorStatusController,
  togglePropertyTenantStatusController,
} from '../controllers';
import {handleUnhandledControllerError} from '../util';


export const indexHealthCheckHandler = makeIndexHealthCheckHandler(
    handleUnhandledControllerError,
    executeAnonymousController,
    indexHealthCheckController,
);

export const createPropertyHandler = makeCreatePropertyHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    createPropertyController,
);

export const acceptTenantInvitationHandler = makeAcceptTenantInvitationHandler(
    handleUnhandledControllerError,
    executeAnonymousController,
    acceptTenantInvitationToPropertyController,
);

export const deletePropertyByIdHandler = makeDeletePropertyByIdHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    deletePropertyByIdController,
);

export const getPropertiesWhereInvolvedHandler = makeGetPropertiesWhereInvolvedHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    getPropertiesWhereInvolvedController,
);

export const togglePropertyAdministratorStatusHandler = makeTogglePropertyAdministratorStatusHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    togglePropertyAdministratorStatusController,
);

export const togglePropertyTenantStatusHandler = makeTogglePropertyTenantStatusHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    togglePropertyTenantStatusController,
);

export const getPropertyByIdHandler = makeGetPropertyByIdHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    getPropertyByIdController,
);

export const inviteTenantToPropertyHandler = makeInviteTenantToPropertyHandler(
    handleUnhandledControllerError,
    executeAuthenticatedController,
    inviteTenantToPropertyController,
);
