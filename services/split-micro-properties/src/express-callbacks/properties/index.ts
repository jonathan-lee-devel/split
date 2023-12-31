import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeGetPropertyByIdCallback} from './callbacks/get-property-by-id';
import {makeInviteTenantToPropertyCallback} from './callbacks/invite-tenant-to-property';
import {makeMakeGetPropertyByIdEndpoint} from './endpoints/get-property-by-id';
import {makeMakeInviteTenantToPropertyEndpoint} from './endpoints/invite-tenant-to-property';
import {environment} from '../../environment';
import logger from '../../logger';
import {PropertyInvitationVerificationTokenModel, PropertyModel} from '../../models';
import {makeMailToSendRabbitMQConnection} from '../../rabbitmq';
import {
  GetPropertyByIdRequestBodySchema,
  GetPropertyByIdRequestQuerySchema,
  InviteTenantToPropertyRequestBodySchema,
  InviteTenantToPropertyRequestQuerySchema,
} from '../../schemas';
import {generatePropertyInvitationVerificationToken} from '../../util';

const rabbitMQConnectionPromise = makeMailToSendRabbitMQConnection(
    logger,
    environment.RABBITMQ_URL,
);

export const getPropertyByIdHandler = makeMakeGetPropertyByIdEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetPropertyByIdRequestBodySchema,
    GetPropertyByIdRequestQuerySchema,
    makeGetPropertyByIdCallback(logger, PropertyModel, defaultModelTransform),
);

export const inviteTenantToPropertyHandler = makeMakeInviteTenantToPropertyEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    InviteTenantToPropertyRequestBodySchema,
    InviteTenantToPropertyRequestQuerySchema,
    makeInviteTenantToPropertyCallback(
        logger,
        PropertyModel,
        environment.FRONT_END_URL,
        PropertyInvitationVerificationTokenModel,
        generatePropertyInvitationVerificationToken,
        rabbitMQConnectionPromise,
        defaultModelTransform,
    ),
);
