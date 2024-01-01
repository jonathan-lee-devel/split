import {AnonymousController, HttpStatus, StatusDataContainer} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {
  AcceptTenantInvitationToPropertyRequestBody,
  AcceptTenantInvitationToPropertyRequestHeaders,
  AcceptTenantInvitationToPropertyRequestParams,
  AcceptTenantInvitationToPropertyRequestQuery,
} from '../schemas';
import {PropertyInvitationTokenService} from '../services';

export const makeAcceptTenantInvitationToPropertyController = (
    logger: winston.Logger,
    propertyInvitationTokenService: PropertyInvitationTokenService,
): AnonymousController<
  AcceptTenantInvitationToPropertyRequestBody,
  AcceptTenantInvitationToPropertyRequestParams,
  AcceptTenantInvitationToPropertyRequestQuery,
  AcceptTenantInvitationToPropertyRequestHeaders,
  PropertyDto> =>
  async (body, params) => {
    const {tokenValue} = body;
    const {propertyId} = params;

    logger.info(`Request to accept tenant property invitation for token value: ${tokenValue} at property ID: ${propertyId}`);

    const tokenVerificationResponse = await propertyInvitationTokenService.verifyToken(tokenValue);
    if (tokenVerificationResponse.status !== HttpStatus.OK) {
      return tokenVerificationResponse as StatusDataContainer<never>; // Will contain status and error fields, data undefined
    }

    const {token, property} = tokenVerificationResponse.data!; // Known to be defined as status is OK
    return await propertyInvitationTokenService.acceptValidInvitationToken(token, property);
  };
