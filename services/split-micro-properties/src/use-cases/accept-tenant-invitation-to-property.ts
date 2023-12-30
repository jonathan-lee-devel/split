import {AnonymousEndpointUseCase, HttpStatus} from '@split-common/split-http';
import {isAfter} from 'date-fns/isAfter';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity, PropertyInvitationVerificationTokenEntity} from '../entities';
import {
  AcceptTenantInvitationToPropertyRequestBody,
  AcceptTenantInvitationToPropertyRequestParams,
  AcceptTenantInvitationToPropertyRequestQuery,
} from '../schemas';

export const makeAcceptTenantInvitationToPropertyUseCase = (
    logger: winston.Logger,
    PropertyEntity: PropertyEntity,
    PropertyInvitationVerificationTokenEntity: PropertyInvitationVerificationTokenEntity,
): AnonymousEndpointUseCase<
  AcceptTenantInvitationToPropertyRequestBody,
  AcceptTenantInvitationToPropertyRequestParams,
  AcceptTenantInvitationToPropertyRequestQuery,
  PropertyDto> =>
  async (body, params) => {
    const {tokenValue} = body;
    const {propertyId} = params;

    logger.info(`Request to accept tenant property invitation for token value: ${tokenValue} at property ID: ${propertyId}`);

    const token = await PropertyInvitationVerificationTokenEntity.getOneTransformed({value: tokenValue});
    if (!token) {
      return {status: HttpStatus.BAD_REQUEST, data: {error: `No token found for that value`}};
    }

    if (token.isAccepted) {
      return {status: HttpStatus.BAD_REQUEST, data: {error: `This invitation has already been accepted`}};
    }

    if (isAfter(new Date(), token.expiryDate)) {
      return {status: HttpStatus.BAD_REQUEST, data: {error: `This token is expired, you will need to be re-invited`}};
    }

    const property = await PropertyEntity.getOneTransformed({id: token.propertyId});
    if (!property) {
      return {status: HttpStatus.BAD_REQUEST, data: {error: `No property found for that token value or property does not match path`}};
    }

    const acceptedEmails = new Set<string>(property.acceptedInvitationEmails);
    acceptedEmails.add(token.userEmail);
    property.acceptedInvitationEmails = Array.from(acceptedEmails.values());
    const updatedProperty = await PropertyEntity.updateOneAndReturnTransformed(property);
    await PropertyInvitationVerificationTokenEntity.updateOne(token);
    return {status: HttpStatus.OK, data: updatedProperty};
  };
