import {executeAnonymousController, executeAuthenticatedController} from '@split-common/split-http';

import {makeAcceptTenantInvitationHandler} from './accept-tenant-invitation';
import {makeCreatePropertyHandler} from './create-property';
import {makeDeletePropertyByIdHandler} from './delete-property-by-id';
import {makeIndexHealthCheckController} from './index-health-check';
import {
  acceptTenantInvitationToPropertyController,
  createPropertyController,
  deletePropertyByIdController,
  indexHealthCheckController,
} from '../controllers';
import {handleUnhandledControllerError} from '../util';


export const indexHealthCheckHandler = makeIndexHealthCheckController(
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
