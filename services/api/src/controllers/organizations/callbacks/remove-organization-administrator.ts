import winston from 'winston';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {
  RemoveOrganizationAdministratorRequestBody,
  RemoveOrganizationAdministratorRequestQuery,
} from '../schemas/remove-organization-administrator';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {ADMINISTRATOR_EMAILS_FIELD} from '../../../constants/organizations/field-names';

export const makeRemoveOrganizationAdministratorCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<RemoveOrganizationAdministratorRequestBody, RemoveOrganizationAdministratorRequestQuery> => async (
    req,
    res,
) => {
  const requestingUserEmail = req.user.email;
  const {organizationId} = req.params;
  const {administratorEmailToRemove} = req.body;
  logger.info(`Request from <${requestingUserEmail}> to remove administrator: ${administratorEmailToRemove} from organization with ID: ${organizationId}`);

  const organization = await Organization.findOne({id: organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} does not exist`});
  }

  if (!organization.administratorEmails.includes(requestingUserEmail)) {
    return res.status(HttpStatus.FORBIDDEN).send();
  }

  if (!organization.administratorEmails.includes(administratorEmailToRemove)) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} does not have administrator: ${administratorEmailToRemove}`});
  }

  if (organization.administratorEmails.length <= 1) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} requires at least one administrator`});
  }

  organization.administratorEmails.splice(organization.administratorEmails.indexOf(administratorEmailToRemove, 0), 1);
  await organization.markModified(ADMINISTRATOR_EMAILS_FIELD);
  await organization.save();
  return res.status(HttpStatus.OK).json(organization.toJSON({transform}));
};
