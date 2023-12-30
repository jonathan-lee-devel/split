import {makeGenerateId} from '@split-common/split-auth';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeAcceptTenantInvitationToPropertyUseCase} from './accept-tenant-invitation-to-property';
import {makeCreatePropertyUseCase} from './create-property';
import {makeIndexHealthCheckUseCase} from './index-health-check';
import {PropertyEntity} from '../entities/PropertyEntity';
import {PropertyInvitationVerificationTokenEntity} from '../entities/PropertyInvitationVerificationTokenEntity';
import logger from '../logger';
import {PropertyInvitationVerificationTokenModel, PropertyModel} from '../models';

export const indexHealthCheckUseCase = makeIndexHealthCheckUseCase();

export const createPropertyUseCase = makeCreatePropertyUseCase(
    logger,
    new PropertyEntity(PropertyModel, defaultModelTransform),
    makeGenerateId(logger),
);

export const acceptTenantInvitationUseCase = makeAcceptTenantInvitationToPropertyUseCase(
    logger,
    new PropertyEntity(PropertyModel, defaultModelTransform),
    new PropertyInvitationVerificationTokenEntity(PropertyInvitationVerificationTokenModel, defaultModelTransform),
);
