import {AuthenticatedController, HttpStatus} from '@split-common/split-http';
import winston from 'winston';

import {PropertyDto} from '../dtos';
import {PropertyEntity, PropertyInvitationTokenEntity} from '../entities';
import {
  InviteTenantToPropertyRequestBody,
  InviteTenantToPropertyRequestHeaders,
  InviteTenantToPropertyRequestParams,
  InviteTenantToPropertyRequestQuery,
} from '../schemas';

export const makeInviteTenantToPropertyController = (
    logger: winston.Logger,
    propertyEntity: PropertyEntity,
    propertyInvitationTokenEntity: PropertyInvitationTokenEntity,
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

    const propertyInvitationVerificationResponse = await propertyEntity
        .verifyEmailToInvite(requestingUserEmail, propertyId, emailToInvite);
    if (propertyInvitationVerificationResponse.status !== HttpStatus.OK) {
      return propertyInvitationVerificationResponse;
    }

    const existingTokenVerificationResponse = await propertyInvitationTokenEntity
        .verifyExistingToken(propertyId, emailToInvite);
    if (existingTokenVerificationResponse.status !== HttpStatus.OK) {
      return existingTokenVerificationResponse;
    }

    const updatePropertyResponse = await propertyEntity.addTenantEmail(requestingUserEmail, propertyId, emailToInvite);
    if (updatePropertyResponse.status !== HttpStatus.OK) {
      return updatePropertyResponse;
    }

    const tokenGenerationResponse = await propertyInvitationTokenEntity.generatePropertyInvitationVerificationTokenAndSendEmail(
        propertyId,
        emailToInvite,
    );

    return (tokenGenerationResponse.status === HttpStatus.OK && updatePropertyResponse.data) ?
      updatePropertyResponse :
      tokenGenerationResponse;
  };
