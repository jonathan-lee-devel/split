import {randomBytes} from 'node:crypto';

import {GenerateIdFunction} from '@split-common/split-auth';
import {
  DEFAULT_TOKEN_BUFFER_ENCODING,
  DEFAULT_TOKEN_EXPIRY_TIME_DAYS,
  DEFAULT_TOKEN_SIZE,
  MailToSendMessage,
} from '@split-common/split-constants';
import {HttpStatus} from '@split-common/split-http';
import {RabbitMQConnection} from '@split-common/split-service-config';
import {addDays} from 'date-fns/addDays';
import {isAfter} from 'date-fns/isAfter';

import {PropertyDAO, PropertyInvitationVerificationTokenDAO} from '../dao';
import {PropertyDto, PropertyInvitationVerificationTokenDto} from '../dtos';

export const makePropertyInvitationTokenService = (
    frontEndUrl: string,
    propertyDAO: PropertyDAO,
    propertyInvitationTokenDAO: PropertyInvitationVerificationTokenDAO,
    generateId: GenerateIdFunction,
    rabbitMQConnectionPromiseForMailToSend: Promise<RabbitMQConnection<MailToSendMessage>>,
) => {
  return {
    verifyToken: async (tokenValue: string) => {
      const token = await propertyInvitationTokenDAO.getOneTransformed({value: tokenValue});
      if (!token) {
        return {status: HttpStatus.BAD_REQUEST, error: `No token found for that value`};
      }

      if (token.isAccepted) {
        return {status: HttpStatus.BAD_REQUEST, error: `This invitation has already been accepted`};
      }

      if (isAfter(new Date(), token.expiryDate)) {
        return {status: HttpStatus.BAD_REQUEST, error: `This token is expired, you will need to be re-invited`};
      }

      const property = await propertyDAO.getOneTransformed({id: token.propertyId});
      return (property) ?
        {status: HttpStatus.OK, data: {token, property}} :
        {status: HttpStatus.BAD_REQUEST, error: `No property found for that token value or property does not match path`};
    },
    acceptValidInvitationToken: async (token: PropertyInvitationVerificationTokenDto, property: PropertyDto) => {
      const acceptedEmails = new Set<string>(property.acceptedInvitationEmails);
      acceptedEmails.add(token.userEmail);
      property.acceptedInvitationEmails = Array.from(acceptedEmails.values());
      const updatedProperty = await propertyDAO.updateOneAndReturnTransformed(property);
      token.isAccepted = true;
      await propertyInvitationTokenDAO.updateOne(token);
      return (updatedProperty) ?
        {status: HttpStatus.OK, data: updatedProperty} :
        {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Could not update property with ID: ${property.id}`};
    },
    verifyExistingToken: async (propertyId: string, emailToInvite: string) => {
      const existingToken = await propertyInvitationTokenDAO.getOneTransformed({propertyId, userEmail: emailToInvite});
      return (existingToken && (existingToken.isAccepted || (isAfter(existingToken.expiryDate, new Date())))) ?
        {status: HttpStatus.BAD_REQUEST, error: `${emailToInvite} already has a non-expired or accepted invitation to property with ID: ${propertyId}`} :
        {status: HttpStatus.OK};
    },
    generatePropertyInvitationVerificationTokenAndSendEmail: async (propertyId: string, emailToInvite: string) => {
      const token = await propertyInvitationTokenDAO.createAndReturnTransformed({
        id: await generateId(),
        value: randomBytes(DEFAULT_TOKEN_SIZE / 2).toString(DEFAULT_TOKEN_BUFFER_ENCODING),
        propertyId,
        expiryDate: addDays(new Date(), DEFAULT_TOKEN_EXPIRY_TIME_DAYS),
        userEmail: emailToInvite,
        isAccepted: false,
      });
      if (!token) {
        return {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Token for user email: ${emailToInvite} could not be generated`};
      }
      const property = await propertyDAO.getOneTransformed({id: propertyId});
      if (!property) {
        return {status: HttpStatus.NOT_FOUND, error: `Property with ID: ${propertyId} not found`};
      }
      await (await rabbitMQConnectionPromiseForMailToSend).sendData('mail-to-send', {
        toEmail: emailToInvite,
        subject: `Split Property: ${property.name} Invitation`,
        html: `<h3>Click the following link to accept the invitation: <a href="${frontEndUrl}/properties/${property.id}/invitations/accept/${token.value}">Accept</a></h3>`,
      });
      return {status: HttpStatus.OK};
    },
  };
};
