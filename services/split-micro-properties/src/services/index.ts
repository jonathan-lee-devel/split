import {makeGenerateId} from '@split-common/split-auth';

import {makePropertyService} from './property';
import {makePropertyInvitationTokenService} from './property-invitation-token';
import {defaultPropertyDao, defaultPropertyInvitationTokenDao} from '../dao';
import {environment} from '../environment';
import logger from '../logger';
import {makeMailToSendRabbitMQConnection} from '../rabbitmq';
import {generatePropertyInvitationVerificationToken} from '../util';

const generateId = makeGenerateId(logger);

export const propertyService = makePropertyService(
    defaultPropertyDao,
    generateId,
);

export type PropertyService = typeof propertyService;

const rabbitMQConnectionPromise = makeMailToSendRabbitMQConnection(
    logger,
    environment.RABBITMQ_URL,
);

export const propertyInvitationTokenService = makePropertyInvitationTokenService(
    environment.FRONT_END_URL,
    defaultPropertyDao,
    defaultPropertyInvitationTokenDao,
    generatePropertyInvitationVerificationToken,
    rabbitMQConnectionPromise,
);

export type PropertyInvitationTokenService = typeof propertyInvitationTokenService;
