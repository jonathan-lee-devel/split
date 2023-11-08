import winston from 'winston';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {DeleteOrganizationRequestBody, DeleteOrganizationRequestQuery} from '../schemas/delete-organization';
import {HttpStatus} from '../../../lib/enums/HttpStatus';

export const makeDeleteOrganizationCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<DeleteOrganizationRequestBody, DeleteOrganizationRequestQuery> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {organizationId} = req.params;
  logger.info(`Request from user <${requestingUserEmail}> to delete organization with ID: ${organizationId}`);

  const organization = await Organization.findOne({id: organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.NOT_FOUND).send();
  }

  if (!organization.administratorEmails.includes(requestingUserEmail)) {
    return res.status(HttpStatus.FORBIDDEN).send();
  }

  await Organization.deleteOne({id: organizationId}).exec();
  return res.status(HttpStatus.OK).json(organization.toJSON({transform}));
};
