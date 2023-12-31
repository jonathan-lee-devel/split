import {AnonymousEndpointUseCase, HttpStatus, StatusDataContainer} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyInvitationTokenEntity} from '../entities';
import {
  AcceptTenantInvitationToPropertyRequestBody,
  AcceptTenantInvitationToPropertyRequestParams,
  AcceptTenantInvitationToPropertyRequestQuery,
} from '../schemas';

export const makeAcceptTenantInvitationToPropertyUseCase = (
    logger: winston.Logger,
    propertyInvitationTokenEntity: PropertyInvitationTokenEntity,
): AnonymousEndpointUseCase<
  AcceptTenantInvitationToPropertyRequestBody,
  AcceptTenantInvitationToPropertyRequestParams,
  AcceptTenantInvitationToPropertyRequestQuery,
  PropertyDto> =>
  async (body, params) => {
    const {tokenValue} = body;
    const {propertyId} = params;

    logger.info(`Request to accept tenant property invitation for token value: ${tokenValue} at property ID: ${propertyId}`);

    const tokenVerificationResponse = await propertyInvitationTokenEntity.verifyToken(tokenValue);
    if (tokenVerificationResponse.status !== HttpStatus.OK) {
      return tokenVerificationResponse as StatusDataContainer<PropertyDto>; // Will contain status and error fields, data undefined
    }

    const {token, property} = tokenVerificationResponse.data!; // Known to be defined as status is OK
    return await propertyInvitationTokenEntity.acceptValidInvitationToken(token, property);
  };
