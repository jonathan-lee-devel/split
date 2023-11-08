import winston from 'winston';
import {Model} from 'mongoose';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {
  AcceptOrganizationInvitationRequestBody,
  AcceptOrganizationInvitationRequestQuery,
} from '../schemas/accept-organization-invitation';
import {OrganizationInvitation} from '../../../models/organizations/OrganizationInvitation';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {Organization} from '../../../models/organizations/Organization';
import {OrganizationInvitationStatus} from '../../../lib/enums/organization/OrganizationInvitationStatus';

export const makeAcceptOrganizationInvitationCallback = (
    logger: winston.Logger,
    OrganizationInvitation: Model<OrganizationInvitation>,
    Organization: Model<Organization>,
): AnonymousEndpointCallback<AcceptOrganizationInvitationRequestBody, AcceptOrganizationInvitationRequestQuery> => async (req, res) => {
  const {organizationInvitationValue} = req.body;
  logger.info(`Anonymous request to accept organization invitation with value: ${organizationInvitationValue}`);

  const organizationInvitation = await OrganizationInvitation.findOne({value: organizationInvitationValue}).exec();
  if (!organizationInvitation) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization invitation with value: ${organizationInvitationValue} does not exist`});
  }

  if (organizationInvitation.isAccepted) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization invitation with value: ${organizationInvitationValue} is already accepted`});
  }

  if (organizationInvitation.expiryDate.getTime() < new Date().getTime()) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization invitation with value: ${organizationInvitationValue} is expired`});
  }

  const organization = await Organization.findOne({id: organizationInvitation.organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationInvitation.organizationId} does not exist`});
  }

  if (!organization.memberEmails.includes(organizationInvitation.emailToInvite)) {
    organization.memberEmails.push(organizationInvitation.emailToInvite);
    organization.markModified('memberEmails');
    await organization.save();
  } else {
    logger.info(`Organization with ID: ${organization.id} already had member: ${organizationInvitation.emailToInvite}, no action taken`);
  }

  organizationInvitation.isAccepted = true;
  await organizationInvitation.save();
  return res.status(HttpStatus.OK).json({status: OrganizationInvitationStatus[OrganizationInvitationStatus.SUCCESS]});
};
