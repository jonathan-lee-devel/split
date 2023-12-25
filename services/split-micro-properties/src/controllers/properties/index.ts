import {makeGenerateId} from '@split-common/split-auth';
import {returnAnonymouslyBasedOnSafeParseResult, returnBasedOnAuthenticationAndSafeParseResult} from '@split-common/split-http';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeAcceptTenantInvitationToPropertyCallback} from './callbacks/accept-tenant-invitation-to-property';
import {makeCreatePropertyCallback} from './callbacks/create-property';
import {makeDeletePropertyByIdCallback} from './callbacks/delete-property-by-id';
import {makeGetPropertiesWhereInvolvedCallback} from './callbacks/get-properties-where-involved';
import {makeGetPropertyByIdCallback} from './callbacks/get-property-by-id';
import {makeInviteTenantToPropertyCallback} from './callbacks/invite-tenant-to-property';
import {makeTogglePropertyAdministratorStatusCallback} from './callbacks/toggle-property-administrator-status';
import {makeTogglePropertyTenantStatusCallback} from './callbacks/toggle-property-tenant-status';
import {makeMakeAcceptTenantInvitationToPropertyEndpoint} from './endpoints/accept-tenant-invitation-to-property';
import {makeMakeCreatePropertyEndpoint} from './endpoints/create-property';
import {makeMakeDeletePropertyByIdEndpoint} from './endpoints/delete-property-by-id';
import {makeMakeGetPropertiesWhereInvolvedEndpoint} from './endpoints/get-properties-where-involved';
import {makeMakeGetPropertyByIdEndpoint} from './endpoints/get-property-by-id';
import {makeMakeInviteTenantToPropertyEndpoint} from './endpoints/invite-tenant-to-property';
import {makeMakeTogglePropertyAdministratorStatusEndpoint} from './endpoints/toggle-property-administrator-status';
import {makeMakeTogglePropertyTenantStatusEndpoint} from './endpoints/toggle-property-tenant-status';
import {
  AcceptTenantInvitationToPropertyRequestBodySchema,
  AcceptTenantInvitationToPropertyRequestQuerySchema,
} from './schemas/accept-tenant-invitation-to-property';
import {CreatePropertyRequestBodySchema, CreatePropertyRequestQuerySchema} from './schemas/create-property';
import {DeletePropertyByIdRequestBodySchema, DeletePropertyByIdRequestQuerySchema} from './schemas/delete-property-by-id';
import {
  GetPropertiesWhereInvolvedRequestBodySchema,
  GetPropertiesWhereInvolvedRequestQuerySchema,
} from './schemas/get-properties-where-involved';
import {GetPropertyByIdRequestBodySchema, GetPropertyByIdRequestQuerySchema} from './schemas/get-property-by-id';
import {InviteTenantToPropertyRequestBodySchema, InviteTenantToPropertyRequestQuerySchema} from './schemas/invite-tenant-to-property';
import {
  TogglePropertyAdministratorStatusRequestBodySchema,
  TogglePropertyAdministratorStatusRequestQuerySchema,
} from './schemas/toggle-property-administrator-status';
import {
  TogglePropertyTenantStatusRequestBodySchema,
  TogglePropertyTenantStatusRequestQuerySchema,
} from './schemas/toggle-property-tenant-status';
import {environment} from '../../environment';
import logger from '../../logger';
import {PropertyModel} from '../../models';
import {PropertyInvitationVerificationTokenModel} from '../../models/property/PropertyInvitationVerificationToken';
import {makeMailToSendRabbitMQConnection} from '../../rabbitmq';
import {generatePropertyInvitationVerificationToken} from '../../util';

const rabbitMQConnectionPromise = makeMailToSendRabbitMQConnection(
    logger,
    environment.RABBITMQ_URL,
);

export const createPropertyHandler = makeMakeCreatePropertyEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    CreatePropertyRequestBodySchema,
    CreatePropertyRequestQuerySchema,
    makeCreatePropertyCallback(logger, makeGenerateId(logger), PropertyModel, defaultModelTransform),
);

export const getPropertyByIdHandler = makeMakeGetPropertyByIdEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetPropertyByIdRequestBodySchema,
    GetPropertyByIdRequestQuerySchema,
    makeGetPropertyByIdCallback(logger, PropertyModel, defaultModelTransform),
);

export const getPropertiesWhereInvolvedHandler = makeMakeGetPropertiesWhereInvolvedEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetPropertiesWhereInvolvedRequestBodySchema,
    GetPropertiesWhereInvolvedRequestQuerySchema,
    makeGetPropertiesWhereInvolvedCallback(logger, PropertyModel, defaultModelTransform),
);

export const deletePropertyByIdHandler = makeMakeDeletePropertyByIdEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    DeletePropertyByIdRequestBodySchema,
    DeletePropertyByIdRequestQuerySchema,
    makeDeletePropertyByIdCallback(logger, PropertyModel, defaultModelTransform),
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

export const acceptTenantInvitationToPropertyHandler =
  makeMakeAcceptTenantInvitationToPropertyEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
      AcceptTenantInvitationToPropertyRequestBodySchema,
      AcceptTenantInvitationToPropertyRequestQuerySchema,
      makeAcceptTenantInvitationToPropertyCallback(
          logger,
          PropertyModel,
          PropertyInvitationVerificationTokenModel,
          defaultModelTransform,
      ),
  );
