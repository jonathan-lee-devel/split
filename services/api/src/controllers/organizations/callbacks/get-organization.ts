import winston from 'winston';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {GetOrganizationRequestBody, GetOrganizationRequestQuery} from '../schemas/get-organization';
import {HttpStatus} from '../../../lib/enums/HttpStatus';

export const makeGetOrganizationCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<GetOrganizationRequestBody, GetOrganizationRequestQuery> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {organizationId} = req.params;
  logger.info(`Request from <${requestingUserEmail}> to get organization with ID: ${organizationId}`);

  const organization = await Organization.findOne({id: organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.NOT_FOUND).send();
  }

  if (!organization.administratorEmails.includes(requestingUserEmail) &&
  !organization.memberEmails.includes(requestingUserEmail)) {
    return res.status(HttpStatus.FORBIDDEN).send();
  }

  return res.status(HttpStatus.OK).json(organization.toJSON({transform}));
};
