import {returnAnonymouslyBasedOnSafeParseResult, returnBasedOnAuthenticationAndSafeParseResult} from '../../lib/endpoint-util';
import logger from '../../logger';
import {makeCreateOrganizationCallback} from './callbacks/create-organization';
import {makeMakeCreateOrganizationEndpoint} from './endpoints/create-organization';
import {CreateOrganizationRequestBodySchema, CreateOrganizationRequestQuerySchema} from './schemas/create-organization';
import {generateId} from '../../lib/generate-id';
import {makeMakeGetOrganizationSnippetEndpoint} from './endpoints/get-organization-snippet';
import {GetOrganizationSnippetRequestBodySchema, GetOrganizationSnippetRequestQuerySchema} from './schemas/get-organization-snippet';
import {makeGetOrganizationSnippetCallback} from './callbacks/get-organization-snippet';
import {makeMakeSearchOrganizationEndpoint} from './endpoints/search-organizations';
import {SearchOrganizationsRequestBodySchema, SearchOrganizationsRequestQuerySchema} from './schemas/search-organizations';
import {makeSearchOrganizationsCallback} from './callbacks/search-organizations';
import {OrganizationModel} from '../../models/organizations/Organization';
import {defaultModelTransform} from '../../lib/model-transform/default-model-transform';
import {organizationSnippetModelTransform} from '../../lib/model-transform/organization-snippet-model-transform';
import {makeMakeGetOrganizationsWhereInvolvedEndpoint} from './endpoints/get-organizations-where-involved';
import {
  GetOrganizationsWhereInvolvedRequestBodySchema,
  GetOrganizationsWhereInvolvedRequestQuerySchema,
} from './schemas/get-organizations-where-involved';
import {makeGetOrganizationsWhereInvolvedCallback} from './callbacks/get-organizations-where-involved';
import {makeMakeGetOrganizationEndpoint} from './endpoints/get-organization';
import {GetOrganizationRequestBodySchema, GetOrganizationRequestQuerySchema} from './schemas/get-organization';
import {makeGetOrganizationCallback} from './callbacks/get-organization';
import {makeMakeDeleteOrganizationEndpoint} from './endpoints/delete-organization';
import {DeleteOrganizationRequestBodySchema, DeleteOrganizationRequestQuerySchema} from './schemas/delete-organization';
import {makeDeleteOrganizationCallback} from './callbacks/delete-organization';
import {makeMakeRemoveOrganizationAdministratorEndpoint} from './endpoints/remove-organization-administrator';
import {
  RemoveOrganizationAdministratorRequestBodySchema,
  RemoveOrganizationAdministratorRequestQuerySchema,
} from './schemas/remove-organization-administrator';
import {makeRemoveOrganizationAdministratorCallback} from './callbacks/remove-organization-administrator';
import {makeMakeRemoveOrganizationMemberEndpoint} from './endpoints/remove-organization-member';
import {
  RemoveOrganizationMemberRequestBodySchema,
  RemoveOrganizationMemberRequestQuerySchema,
} from './schemas/remove-organization-member';
import {makeRemoveOrganizationMemberCallback} from './callbacks/remove-organization-member';
import {makeMakeUpdateOrganizationAdministratorJoinAsMemberEndpoint} from './endpoints/update-organization-administrator-join-as-member';
import {
  UpdateOrganizationAdministratorJoinAsMemberRequestBodySchema,
  UpdateOrganizationAdministratorJoinAsMemberRequestQuerySchema,
} from './schemas/update-organization-administrator-join-as-member';
import {makeUpdateOrganizationAdministratorJoinAsMemberCallback} from './callbacks/update-organization-administrator-join-as-member';
import {makeMakeInviteToJoinOrganizationEndpoint} from './endpoints/invite-to-join-organization';
import {InviteToJoinOrganizationQuerySchema, InviteToJoinOrganizationRequestBodySchema} from './schemas/invite-to-join-organization';
import {makeInviteToJoinOrganizationCallback} from './callbacks/invite-to-join-organization';
import {OrganizationInvitationModel} from '../../models/organizations/OrganizationInvitation';
import {sendMail} from '../../util';
import {environment} from '../../environment';
import {makeMakeAcceptOrganizationInvitationEndpoint} from './endpoints/accept-organization-invitation';
import {
  AcceptOrganizationInvitationRequestBodySchema,
  AcceptOrganizationInvitationRequestQuerySchema,
} from './schemas/accept-organization-invitation';
import {makeAcceptOrganizationInvitationCallback} from './callbacks/accept-organization-invitation';
import {
  GetOrganizationSnippetFromOrganizationInvitationRequestBodySchema,
  GetOrganizationSnippetFromOrganizationInvitationRequestQuerySchema,
} from './schemas/get-organization-snippet-from-invitation';
import {makeMakeGetOrganizationSnippetFromOrganizationInvitationEndpoint} from './endpoints/get-organization-snippet-from-invitation';
import {makeGetOrganizationSnippetFromOrganizationInvitationCallback} from './callbacks/get-organization-snippet-from-invitation';
import {makeMakeUpdateOrganizationMemberJoinAsAdministratorEndpoint} from './endpoints/update-organization-member-join-as-administrator';
import {
  UpdateOrganizationMemberJoinAsAdministratorRequestBodySchema,
  UpdateOrganizationMemberJoinAsAdministratorRequestQuerySchema,
} from './schemas/update-organization-member-join-as-administrator';
import {makeUpdateOrganizationMemberJoinAsAdministratorCallback} from './callbacks/update-organization-member-join-as-administrator';

export const getOrganizationHandler = makeMakeGetOrganizationEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    GetOrganizationRequestBodySchema,
    GetOrganizationRequestQuerySchema,
    makeGetOrganizationCallback(logger, OrganizationModel, defaultModelTransform),
);

export const getOrganizationSnippetHandler = makeMakeGetOrganizationSnippetEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    GetOrganizationSnippetRequestBodySchema,
    GetOrganizationSnippetRequestQuerySchema,
    makeGetOrganizationSnippetCallback(logger, OrganizationModel, organizationSnippetModelTransform),
);

export const createOrganizationHandler = makeMakeCreateOrganizationEndpoint(returnBasedOnAuthenticationAndSafeParseResult)(
    CreateOrganizationRequestBodySchema,
    CreateOrganizationRequestQuerySchema,
    makeCreateOrganizationCallback(logger, OrganizationModel, generateId, defaultModelTransform),
);

export const searchOrganizationsHandler = makeMakeSearchOrganizationEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    SearchOrganizationsRequestBodySchema,
    SearchOrganizationsRequestQuerySchema,
    makeSearchOrganizationsCallback(logger, OrganizationModel, organizationSnippetModelTransform),
);

export const getOrganizationsWhereInvolvedHandler = makeMakeGetOrganizationsWhereInvolvedEndpoint(
    returnBasedOnAuthenticationAndSafeParseResult)(
    GetOrganizationsWhereInvolvedRequestBodySchema,
    GetOrganizationsWhereInvolvedRequestQuerySchema,
    makeGetOrganizationsWhereInvolvedCallback(logger, OrganizationModel, defaultModelTransform),
);

export const deleteOrganizationHandler = makeMakeDeleteOrganizationEndpoint(
    returnBasedOnAuthenticationAndSafeParseResult)(
    DeleteOrganizationRequestBodySchema,
    DeleteOrganizationRequestQuerySchema,
    makeDeleteOrganizationCallback(logger, OrganizationModel, defaultModelTransform),
);

export const removeOrganizationAdministratorHandler = makeMakeRemoveOrganizationAdministratorEndpoint(
    returnBasedOnAuthenticationAndSafeParseResult)(
    RemoveOrganizationAdministratorRequestBodySchema,
    RemoveOrganizationAdministratorRequestQuerySchema,
    makeRemoveOrganizationAdministratorCallback(logger, OrganizationModel, defaultModelTransform),
);

export const removeOrganizationMemberHandler = makeMakeRemoveOrganizationMemberEndpoint(
    returnBasedOnAuthenticationAndSafeParseResult)(
    RemoveOrganizationMemberRequestBodySchema,
    RemoveOrganizationMemberRequestQuerySchema,
    makeRemoveOrganizationMemberCallback(logger, OrganizationModel, defaultModelTransform),
);

export const updateOrganizationAdministratorJoinAsMemberHandler = makeMakeUpdateOrganizationAdministratorJoinAsMemberEndpoint(
    returnBasedOnAuthenticationAndSafeParseResult)(
    UpdateOrganizationAdministratorJoinAsMemberRequestBodySchema,
    UpdateOrganizationAdministratorJoinAsMemberRequestQuerySchema,
    makeUpdateOrganizationAdministratorJoinAsMemberCallback(logger, OrganizationModel, defaultModelTransform),
);

export const updateOrganizationMemberJoinAsAdministratorHandler = makeMakeUpdateOrganizationMemberJoinAsAdministratorEndpoint(
    returnBasedOnAuthenticationAndSafeParseResult)(
    UpdateOrganizationMemberJoinAsAdministratorRequestBodySchema,
    UpdateOrganizationMemberJoinAsAdministratorRequestQuerySchema,
    makeUpdateOrganizationMemberJoinAsAdministratorCallback(logger, OrganizationModel, defaultModelTransform),
);

export const inviteToJoinOrganizationHandler = makeMakeInviteToJoinOrganizationEndpoint(
    returnBasedOnAuthenticationAndSafeParseResult,
)(
    InviteToJoinOrganizationRequestBodySchema,
    InviteToJoinOrganizationQuerySchema,
    makeInviteToJoinOrganizationCallback(logger, OrganizationModel, OrganizationInvitationModel, generateId, sendMail, environment),
);

export const getOrganizationSnippetFromOrganizationInvitationHandler =
  makeMakeGetOrganizationSnippetFromOrganizationInvitationEndpoint(
      returnAnonymouslyBasedOnSafeParseResult,
  )(
      GetOrganizationSnippetFromOrganizationInvitationRequestBodySchema,
      GetOrganizationSnippetFromOrganizationInvitationRequestQuerySchema,
      makeGetOrganizationSnippetFromOrganizationInvitationCallback(
          logger,
          OrganizationInvitationModel,
          OrganizationModel,
          organizationSnippetModelTransform,
      ),
  );

export const acceptOrganizationInvitationHandler = makeMakeAcceptOrganizationInvitationEndpoint(
    returnAnonymouslyBasedOnSafeParseResult,
)(
    AcceptOrganizationInvitationRequestBodySchema,
    AcceptOrganizationInvitationRequestQuerySchema,
    makeAcceptOrganizationInvitationCallback(logger, OrganizationInvitationModel, OrganizationModel),
);
