import winston from 'winston';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {GetOrganizationSnippetRequestBody, GetOrganizationSnippetRequestQuery} from '../schemas/get-organization-snippet';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {OrganizationInvitation} from '../../../models/organizations/OrganizationInvitation';

export const makeGetOrganizationSnippetFromOrganizationInvitationCallback = (
    logger: winston.Logger,
    OrganizationInvitation: Model<OrganizationInvitation>,
    Organization: Model<Organization>,
    transform: ModelTransformFunction,
): AnonymousEndpointCallback<GetOrganizationSnippetRequestBody, GetOrganizationSnippetRequestQuery> => async (req, res) => {
  const {organizationInvitationValue} = req.params;
  logger.info(`Request to get organization snippet for organization invitation with ID: ${organizationInvitationValue}`);

  const organizationInvitation = await OrganizationInvitation.findOne({value: organizationInvitationValue}).exec();
  if (!organizationInvitation) {
    return res.status(HttpStatus.NOT_FOUND).send();
  }

  const organization = await Organization.findOne({id: organizationInvitation.organizationId}).exec();
  return (!organization) ?
    res.status(HttpStatus.NOT_FOUND).send() :
    res.status(HttpStatus.OK).json(organization.toJSON({transform}));
};
