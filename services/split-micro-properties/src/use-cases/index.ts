import {makeAcceptTenantInvitationToPropertyUseCase} from './accept-tenant-invitation-to-property';
import {makeCreatePropertyUseCase} from './create-property';
import {makeIndexHealthCheckUseCase} from './index-health-check';
import {propertyEntity, propertyInvitationTokenEntity} from '../entities';
import logger from '../logger';

export const indexHealthCheckUseCase = makeIndexHealthCheckUseCase();

export const createPropertyUseCase = makeCreatePropertyUseCase(
    logger,
    propertyEntity,
);

export const acceptTenantInvitationUseCase = makeAcceptTenantInvitationToPropertyUseCase(
    logger,
    propertyInvitationTokenEntity,
);
