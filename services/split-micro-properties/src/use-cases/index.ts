import {makeGenerateId} from '@split-common/split-auth';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeAcceptTenantInvitationToPropertyUseCase} from './accept-tenant-invitation-to-property';
import {makeCreatePropertyUseCase} from './create-property';
import {makeIndexHealthCheckUseCase} from './index-health-check';
import {makeDefaultPropertyDao, PropertyDAO, PropertyInvitationVerificationTokenDAO} from '../dao';
import {makePropertyEntity} from '../entities/property';
import logger from '../logger';
import {PropertyInvitationVerificationTokenModel, PropertyModel} from '../models';

export const indexHealthCheckUseCase = makeIndexHealthCheckUseCase();

export const createPropertyUseCase = makeCreatePropertyUseCase(
    logger,
    makePropertyEntity(makeDefaultPropertyDao(), makeGenerateId(logger)),
);

export const acceptTenantInvitationUseCase = makeAcceptTenantInvitationToPropertyUseCase(
    logger,
    new PropertyDAO(PropertyModel, defaultModelTransform),
    new PropertyInvitationVerificationTokenDAO(PropertyInvitationVerificationTokenModel, defaultModelTransform),
);
