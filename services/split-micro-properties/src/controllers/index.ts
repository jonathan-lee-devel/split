import {executeAnonymousController, executeAuthenticatedController} from '@split-common/split-http';

import {makeAcceptTenantInvitationController} from './accept-tenant-invitation';
import {makeCreatePropertyController} from './create-property';
import {makeDeletePropertyByIdController} from './delete-property-by-id';
import {makeIndexHealthCheckController} from './index-health-check';
import logger from '../logger';
import {acceptTenantInvitationUseCase, createPropertyUseCase, deletePropertyByIdUseCase} from '../use-cases';


export const indexHealthCheckHandler = makeIndexHealthCheckController(
    logger,
    executeAnonymousController,
);

export const createPropertyHandler = makeCreatePropertyController(
    logger,
    executeAuthenticatedController,
    createPropertyUseCase,
);

export const acceptTenantInvitationHandler = makeAcceptTenantInvitationController(
    logger,
    executeAnonymousController,
    acceptTenantInvitationUseCase,
);

export const deletePropertyByIdHandler = makeDeletePropertyByIdController(
    logger,
    executeAuthenticatedController,
    deletePropertyByIdUseCase,
);
