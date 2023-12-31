import {makeGenerateId} from '@split-common/split-auth';

import {makePropertyEntity} from './property';
import {makePropertyInvitationTokenEntity} from './property-invitation-token';
import {defaultPropertyDao, defaultPropertyInvitationTokenDao} from '../dao';
import {environment} from '../environment';
import logger from '../logger';
import {makeMailToSendRabbitMQConnection} from '../rabbitmq';
import {generatePropertyInvitationVerificationToken} from '../util';

const generateId = makeGenerateId(logger);

export const propertyEntity = makePropertyEntity(
    defaultPropertyDao,
    generateId,
);

export type PropertyEntity = typeof propertyEntity;

const rabbitMQConnectionPromise = makeMailToSendRabbitMQConnection(
    logger,
    environment.RABBITMQ_URL,
);

export const propertyInvitationTokenEntity = makePropertyInvitationTokenEntity(
    environment.FRONT_END_URL,
    defaultPropertyDao,
    defaultPropertyInvitationTokenDao,
    generatePropertyInvitationVerificationToken,
    rabbitMQConnectionPromise,
);

export type PropertyInvitationTokenEntity = typeof propertyInvitationTokenEntity;
