import {makeGenerateId} from '@split-common/split-auth';

import {makePropertyEntity} from './property';
import {makePropertyInvitationTokenEntity} from './property-invitation-token';
import {defaultPropertyDao, defaultPropertyInvitationTokenDao} from '../dao';
import logger from '../logger';

const generateId = makeGenerateId(logger);

export const propertyEntity = makePropertyEntity(
    defaultPropertyDao,
    generateId,
);

export type PropertyEntity = typeof propertyEntity;

export const propertyInvitationTokenEntity = makePropertyInvitationTokenEntity(
    defaultPropertyDao,
    defaultPropertyInvitationTokenDao,
);

export type PropertyInvitationTokenEntity = typeof propertyInvitationTokenEntity;
