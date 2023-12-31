import {HttpStatus} from '@split-common/split-http';
import {isAfter} from 'date-fns/isAfter';

import {PropertyDAO, PropertyInvitationVerificationTokenDAO} from '../dao';
import {PropertyDto, PropertyInvitationVerificationTokenDto} from '../dtos';

export const makePropertyInvitationTokenEntity = (
    propertyDAO: PropertyDAO,
    propertyInvitationTokenDAO: PropertyInvitationVerificationTokenDAO,
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
      if (!property) {
        return {status: HttpStatus.BAD_REQUEST, error: `No property found for that token value or property does not match path`};
      }

      return {status: HttpStatus.OK, data: {token, property}};
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
  };
};
