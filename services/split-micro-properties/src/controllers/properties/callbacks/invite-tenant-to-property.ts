import {MailToSendMessage} from '@split-common/split-constants';
import {AuthenticatedEndpointCallback, HttpStatus, wrapTryCatchAuthenticated} from '@split-common/split-http';
import {ModelTransformFunction, RabbitMQConnection} from '@split-common/split-service-config';
import {Model} from 'mongoose';
import winston from 'winston';

import {Property} from '../../../models';
import {GeneratePropertyInvitationVerificationTokenFunction} from '../../../util/property/generate-property-invitation-verification-token';
import {InviteTenantToPropertyRequestBody, InviteTenantToPropertyRequestQuery} from '../schemas/invite-tenant-to-property';

export const makeInviteTenantToPropertyCallback = (
    logger: winston.Logger,
    Property: Model<Property>,
    frontEndUrl: string,
    generatePropertyInvitationVerificationToken: GeneratePropertyInvitationVerificationTokenFunction,
    rabbitMQConnection: Promise<RabbitMQConnection<MailToSendMessage>>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<InviteTenantToPropertyRequestBody, InviteTenantToPropertyRequestQuery> =>
  wrapTryCatchAuthenticated<
    InviteTenantToPropertyRequestBody,
    InviteTenantToPropertyRequestQuery
  >(async (req, res) => {
    const requestingUserEmail = req.user.email;
    const {emailToInvite} = req.body;
    const {propertyId} = req.params;
    logger.info(`Request from <${requestingUserEmail}> to invite email: <${emailToInvite}> for ID: ${propertyId}`);

    const property = await Property.findOne({id: propertyId}).exec();
    if (!property) {
      return res.status(HttpStatus.NOT_FOUND).send();
    }

    if (!property.administratorEmails.includes(requestingUserEmail)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    if (property.tenantEmails.includes(emailToInvite)) {
      return res.status(HttpStatus.BAD_REQUEST).json({error: `${emailToInvite} is already a tenant in property with ID: ${propertyId}`});
    }

    property.tenantEmails.push(emailToInvite);
    property.markModified('tenantEmails');
    await property.save();

    const token = await generatePropertyInvitationVerificationToken(emailToInvite, propertyId);
    await (await rabbitMQConnection).sendData('mail-to-send', {
      toEmail: emailToInvite,
      subject: `Split Property: ${property.name} Invitation`,
      html: `<h3>Click the following link to accept the invitation: <a href="${frontEndUrl}/properties/invitations/accept/${token.value}">Accept</a></h3>`,
    });

    return res.status(HttpStatus.OK).json(property.toJSON({transform}));
  }) as any;
