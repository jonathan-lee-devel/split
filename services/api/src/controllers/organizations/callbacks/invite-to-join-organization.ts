import winston from 'winston';
import {Model} from 'mongoose';
import addDays from 'date-fns/addDays';
import {Organization} from '../../../models/organizations/Organization';
import {OrganizationInvitation} from '../../../models/organizations/OrganizationInvitation';
import {GenerateIdFunction} from '../../../lib/generate-id';
import {SendMailFunction} from '../../../util/email/send-mail';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {InviteToJoinOrganizationRequestBody, InviteToJoinOrganizationRequestQuery} from '../schemas/invite-to-join-organization';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {DEFAULT_TOKEN_EXPIRY_TIME_DAYS, DEFAULT_TOKEN_SIZE} from '../../../constants/token/token';
import {Environment} from '../../../environment';
import {ORGANIZATION_INVITATION_EMAIL_SUBJECT} from '../../../constants/organizations/email-constants';
import {OrganizationInvitationStatus} from '../../../lib/enums/organization/OrganizationInvitationStatus';

export const makeInviteToJoinOrganizationCallback = (
    logger: winston.Logger,
    Organization: Model<Organization>,
    OrganizationInvitation: Model<OrganizationInvitation>,
    generateId: GenerateIdFunction,
    sendMail: SendMailFunction,
    environment: Environment,
): AuthenticatedEndpointCallback<InviteToJoinOrganizationRequestBody, InviteToJoinOrganizationRequestQuery> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const {emailToInvite} = req.body;
  const {organizationId} = req.params;
  logger.info(`Request from <${requestingUserEmail}> to invite: ${emailToInvite} to organization with ID: ${organizationId}`);

  const organization = await Organization.findOne({id: organizationId}).exec();
  if (!organization) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} does not exist`});
  }

  if (!organization.administratorEmails.includes(requestingUserEmail)) {
    return res.status(HttpStatus.FORBIDDEN).send();
  }

  if (organization.memberEmails.includes(emailToInvite)) {
    return res.status(HttpStatus.BAD_REQUEST).json({error: `Organization with ID: ${organizationId} already has member: ${emailToInvite}`});
  }

  const organizationInvitation = await OrganizationInvitation.findOne({organizationId, emailToInvite}).exec();
  if (organizationInvitation && organizationInvitation.expiryDate.getTime() >= new Date().getTime()) {
    return res.status(HttpStatus.CONFLICT).send();
  }

  const newOrganizationInvitation: OrganizationInvitation = {
    id: await generateId(),

    organizationId,
    requestingUserEmail,
    isAccepted: false,
    value: await generateId(DEFAULT_TOKEN_SIZE),
    expiryDate: addDays(new Date(), DEFAULT_TOKEN_EXPIRY_TIME_DAYS),
    emailToInvite,
  };
  await OrganizationInvitation.create(newOrganizationInvitation);
  sendMail(emailToInvite, ORGANIZATION_INVITATION_EMAIL_SUBJECT,
      `<h3>You have been invited to join an organization</h3>
<p>Click the following link to view an invitation to join an organization <a href="${environment.FRONT_END_URL}/organizations/invitations/${newOrganizationInvitation.value}">View Invitation</a><p>`)
      .catch((err) => {
        logger.error(`Error sending e-mail to ${emailToInvite}: ${err}`);
      });
  logger.info(`Organization invitation sent to e-mail: <${emailToInvite}>`);
  return res.status(HttpStatus.OK).json({status: OrganizationInvitationStatus[OrganizationInvitationStatus.AWAITING_RESPONSE]});
};
