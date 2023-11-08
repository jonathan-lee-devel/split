import winston from 'winston';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {
  UpdateOrganizationAdministratorJoinAsMemberRequestBody,
  UpdateOrganizationAdministratorJoinAsMemberRequestQuery,
} from '../schemas/update-organization-administrator-join-as-member';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {MEMBER_EMAILS_FIELD} from '../../../constants/organizations/field-names';

export const makeUpdateOrganizationAdministratorJoinAsMemberCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<
  UpdateOrganizationAdministratorJoinAsMemberRequestBody,
  UpdateOrganizationAdministratorJoinAsMemberRequestQuery
> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {organizationId} = req.params;
  const {administratorEmailToUpdate} = req.body;
  logger.info(`Request for user <${requestingUserEmail}> to update administrator: ${administratorEmailToUpdate} to join as member for organization with ID: ${organizationId}`);

  const organization = await Organization.findOne({id: organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} does not exist`});
  }

  if (!organization.administratorEmails.includes(requestingUserEmail)) {
    return res.status(HttpStatus.FORBIDDEN).send();
  }

  if (organization.memberEmails.includes(administratorEmailToUpdate)) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `User: ${administratorEmailToUpdate} is already a member of organization with ID: ${organizationId}`});
  }

  organization.memberEmails.push(administratorEmailToUpdate);
  await organization.markModified(MEMBER_EMAILS_FIELD);
  await organization.save();
  return res.status(HttpStatus.OK).json(organization.toJSON({transform}));
};
