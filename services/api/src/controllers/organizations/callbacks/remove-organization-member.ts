import winston from 'winston';
import {Model} from 'mongoose';
import {Organization} from '../../../models/organizations/Organization';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {RemoveOrganizationMemberRequestBody, RemoveOrganizationMemberRequestQuery} from '../schemas/remove-organization-member';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {MEMBER_EMAILS_FIELD} from '../../../constants/organizations/field-names';

export const makeRemoveOrganizationMemberCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<RemoveOrganizationMemberRequestBody, RemoveOrganizationMemberRequestQuery> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {organizationId} = req.params;
  const {memberEmailToRemove} = req.body;
  logger.info(`Request from <${requestingUserEmail}> to remove member: ${memberEmailToRemove} from organization with ID: ${organizationId}`);

  const organization = await Organization.findOne({id: organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} does not exist`});
  }

  if (!organization.administratorEmails.includes(requestingUserEmail)) {
    return res.status(HttpStatus.FORBIDDEN).send();
  }

  if (!organization.memberEmails.includes(memberEmailToRemove)) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} does not have member: ${memberEmailToRemove}`});
  }

  organization.memberEmails.splice(organization.memberEmails.indexOf(memberEmailToRemove, 0), 1);
  await organization.markModified(MEMBER_EMAILS_FIELD);
  await organization.save();
  return res.status(HttpStatus.OK).json(organization.toJSON({transform}));
};
