import {makeGenerateId} from '@split-common/split-auth';

import {makePropertyEntity} from './property';
import {makePropertyInvitationTokenEntity} from './property-invitation-token';
import {makeDefaultPropertyDao, makeDefaultPropertyInvitationVerificationTokenDao} from '../dao';
import logger from '../logger';

export const propertyEntity = makePropertyEntity(
    makeDefaultPropertyDao(),
    makeGenerateId(logger),
);

export type PropertyEntity = typeof propertyEntity;

export const propertyInvitationTokenEntity = makePropertyInvitationTokenEntity(
    makeDefaultPropertyDao(),
    makeDefaultPropertyInvitationVerificationTokenDao(),
);

export type PropertyInvitationTokenEntity = typeof propertyInvitationTokenEntity;
