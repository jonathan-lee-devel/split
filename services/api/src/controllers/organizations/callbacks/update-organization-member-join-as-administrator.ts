import winston from 'winston';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {
  UpdateOrganizationMemberJoinAsAdministratorRequestBody,
  UpdateOrganizationMemberJoinAsAdministratorRequestQuery,
} from '../schemas/update-organization-member-join-as-administrator';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {ADMINISTRATOR_EMAILS_FIELD} from '../../../constants/organizations/field-names';

export const makeUpdateOrganizationMemberJoinAsAdministratorCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<
  UpdateOrganizationMemberJoinAsAdministratorRequestBody,
  UpdateOrganizationMemberJoinAsAdministratorRequestQuery
> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {organizationId} = req.params;
  const {memberEmailToUpdate} = req.body;
  logger.info(`Request for user <${requestingUserEmail}> to update member: ${memberEmailToUpdate} to join as administrator for organization with ID: ${organizationId}`);

  const organization = await Organization.findOne({id: organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} does not exist`});
  }

  if (!organization.administratorEmails.includes(requestingUserEmail)) {
    return res.status(HttpStatus.FORBIDDEN).send();
  }

  if (organization.administratorEmails.includes(memberEmailToUpdate)) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `User: ${memberEmailToUpdate} is already an administrator of organization with ID: ${organizationId}`});
  }

  organization.administratorEmails.push(memberEmailToUpdate);
  await organization.markModified(ADMINISTRATOR_EMAILS_FIELD);
  await organization.save();
  return res.status(HttpStatus.OK).json(organization.toJSON({transform}));
};
