import {AuthenticatedController, HttpStatus} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {
  InviteTenantToPropertyRequestBody,
  InviteTenantToPropertyRequestHeaders,
  InviteTenantToPropertyRequestParams,
  InviteTenantToPropertyRequestQuery,
} from '../schemas';
import {PropertyInvitationTokenService, PropertyService} from '../services';

export const makeInviteTenantToPropertyController = (
    logger: winston.Logger,
    propertyService: PropertyService,
    propertyInvitationTokenService: PropertyInvitationTokenService,
): AuthenticatedController<
  InviteTenantToPropertyRequestBody,
  InviteTenantToPropertyRequestParams,
  InviteTenantToPropertyRequestQuery,
  InviteTenantToPropertyRequestHeaders,
  PropertyDto> =>
  async (requestingUserEmail, body, params) => {
    const {emailToInvite} = body;
    const {propertyId} = params;

    logger.info(`Request from <${requestingUserEmail}> to invite email: <${emailToInvite}> for ID: ${propertyId}`);

    const propertyInvitationVerificationResponse = await propertyService
        .verifyEmailToInvite(requestingUserEmail, propertyId, emailToInvite);
    if (propertyInvitationVerificationResponse.status !== HttpStatus.OK) {
      return propertyInvitationVerificationResponse;
    }

    const existingTokenVerificationResponse = await propertyInvitationTokenService
        .verifyExistingToken(propertyId, emailToInvite);
    if (existingTokenVerificationResponse.status !== HttpStatus.OK) {
      return existingTokenVerificationResponse;
    }

    const updatePropertyResponse = await propertyService
        .addTenantEmail(requestingUserEmail, propertyId, emailToInvite);
    if (updatePropertyResponse.status !== HttpStatus.OK) {
      return updatePropertyResponse;
    }

    const tokenGenerationResponse = await propertyInvitationTokenService
        .generatePropertyInvitationVerificationTokenAndSendEmail(
            propertyId,
            emailToInvite,
        );

    return (tokenGenerationResponse.status === HttpStatus.OK && updatePropertyResponse.data) ?
      updatePropertyResponse :
      tokenGenerationResponse;
  };
