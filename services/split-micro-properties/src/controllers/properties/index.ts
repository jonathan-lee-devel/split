import {makeGenerateId} from '@split-common/split-auth';
import {
  controllerReturnBasedOnSafeParseResult,
  returnAnonymouslyBasedOnSafeParseResult,
  returnBasedOnAuthenticationAndSafeParseResult,
} from '@split-common/split-http';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeAcceptTenantInvitationToPropertyCallback} from './callbacks/accept-tenant-invitation-to-property';
import {makeDeletePropertyByIdCallback} from './callbacks/delete-property-by-id';
import {makeGetPropertiesWhereInvolvedCallback} from './callbacks/get-properties-where-involved';
import {makeGetPropertyByIdCallback} from './callbacks/get-property-by-id';
import {makeInviteTenantToPropertyCallback} from './callbacks/invite-tenant-to-property';
import {makeTogglePropertyAdministratorStatusCallback} from './callbacks/toggle-property-administrator-status';
import {makeTogglePropertyTenantStatusCallback} from './callbacks/toggle-property-tenant-status';
import {makeMakeAcceptTenantInvitationToPropertyEndpoint} from './endpoints/accept-tenant-invitation-to-property';
import {makeMakeDeletePropertyByIdEndpoint} from './endpoints/delete-property-by-id';
import {makeMakeGetPropertiesWhereInvolvedEndpoint} from './endpoints/get-properties-where-involved';
import {makeMakeGetPropertyByIdEndpoint} from './endpoints/get-property-by-id';
import {makeMakeInviteTenantToPropertyEndpoint} from './endpoints/invite-tenant-to-property';
import {makeMakeTogglePropertyAdministratorStatusEndpoint} from './endpoints/toggle-property-administrator-status';
import {makeMakeTogglePropertyTenantStatusEndpoint} from './endpoints/toggle-property-tenant-status';
import {PropertyEntity} from '../../entities/PropertyEntity';
import {environment} from '../../environment';
import logger from '../../logger';
import {PropertyInvitationVerificationTokenModel, PropertyModel} from '../../models';
import {makeMailToSendRabbitMQConnection} from '../../rabbitmq';
import {
  AcceptTenantInvitationToPropertyRequestBodySchema,
  AcceptTenantInvitationToPropertyRequestQuerySchema,
} from '../../schemas/accept-tenant-invitation-to-property';
import {DeletePropertyByIdRequestBodySchema, DeletePropertyByIdRequestQuerySchema} from '../../schemas/delete-property-by-id';
import {
  GetPropertiesWhereInvolvedRequestBodySchema,
  GetPropertiesWhereInvolvedRequestQuerySchema,
} from '../../schemas/get-properties-where-involved';
import {GetPropertyByIdRequestBodySchema, GetPropertyByIdRequestQuerySchema} from '../../schemas/get-property-by-id';
import {InviteTenantToPropertyRequestBodySchema, InviteTenantToPropertyRequestQuerySchema} from '../../schemas/invite-tenant-to-property';
import {
  TogglePropertyAdministratorStatusRequestBodySchema,
  TogglePropertyAdministratorStatusRequestQuerySchema,
} from '../../schemas/toggle-property-administrator-status';
import {
  TogglePropertyTenantStatusRequestBodySchema,
  TogglePropertyTenantStatusRequestQuerySchema,
} from '../../schemas/toggle-property-tenant-status';
import {makeCreatePropertyUseCase} from '../../use-cases/create-property';
import {generatePropertyInvitationVerificationToken} from '../../util';
import {makeCreatePropertyController} from '../create-property';

const rabbitMQConnectionPromise = makeMailToSendRabbitMQConnection(
    logger,
    environment.RABBITMQ_URL,
);

export const createPropertyHandler = makeCreatePropertyController(
    controllerReturnBasedOnSafeParseResult,
    makeCreatePropertyUseCase(logger, new PropertyEntity(PropertyModel, defaultModelTransform), makeGenerateId(logger)),
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
