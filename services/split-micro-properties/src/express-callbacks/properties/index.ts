import {returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeGetPropertyByIdCallback} from './callbacks/get-property-by-id';
import {makeInviteTenantToPropertyCallback} from './callbacks/invite-tenant-to-property';
import {makeTogglePropertyAdministratorStatusCallback} from './callbacks/toggle-property-administrator-status';
import {makeTogglePropertyTenantStatusCallback} from './callbacks/toggle-property-tenant-status';
import {makeMakeGetPropertyByIdEndpoint} from './endpoints/get-property-by-id';
import {makeMakeInviteTenantToPropertyEndpoint} from './endpoints/invite-tenant-to-property';
import {makeMakeTogglePropertyAdministratorStatusEndpoint} from './endpoints/toggle-property-administrator-status';
import {makeMakeTogglePropertyTenantStatusEndpoint} from './endpoints/toggle-property-tenant-status';
import {environment} from '../../environment';
import logger from '../../logger';
import {PropertyInvitationVerificationTokenModel, PropertyModel} from '../../models';
import {makeMailToSendRabbitMQConnection} from '../../rabbitmq';
import {
  GetPropertyByIdRequestBodySchema,
  GetPropertyByIdRequestQuerySchema,
  InviteTenantToPropertyRequestBodySchema,
  InviteTenantToPropertyRequestQuerySchema,
  TogglePropertyAdministratorStatusRequestBodySchema,
  TogglePropertyAdministratorStatusRequestQuerySchema,
  TogglePropertyTenantStatusRequestBodySchema,
  TogglePropertyTenantStatusRequestQuerySchema,
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

export const togglePropertyAdministratorStatusHandler =
  makeMakeTogglePropertyAdministratorStatusEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
      TogglePropertyAdministratorStatusRequestBodySchema,
      TogglePropertyAdministratorStatusRequestQuerySchema,
      makeTogglePropertyAdministratorStatusCallback(logger, PropertyModel, defaultModelTransform),
  );

export const togglePropertyTenantStatusHandler =
  makeMakeTogglePropertyTenantStatusEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
      TogglePropertyTenantStatusRequestBodySchema,
      TogglePropertyTenantStatusRequestQuerySchema,
      makeTogglePropertyTenantStatusCallback(logger, PropertyModel, defaultModelTransform),
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