import {randomBytes} from 'node:crypto';

import {GenerateIdFunction} from '@split-common/split-auth';
import {DEFAULT_TOKEN_BUFFER_ENCODING, DEFAULT_TOKEN_EXPIRY_TIME_DAYS, DEFAULT_TOKEN_SIZE} from '@split-common/split-constants';
import {addDays} from 'date-fns/addDays';
import {Model} from 'mongoose';
import winston from 'winston';

import {PropertyInvitationVerificationToken} from '../dao';

export type GeneratePropertyInvitationVerificationTokenFunction = (
  userEmail: string,
  propertyId: string,
  tokenSize?: number | undefined,
  expiryTimeDays?: number | undefined,
) => Promise<PropertyInvitationVerificationToken>;

export const makeGeneratePropertyInvitationVerificationToken = (
    logger: winston.Logger,
    PropertyInvitationVerificationToken: Model<PropertyInvitationVerificationToken>,
    generateId: GenerateIdFunction,
): GeneratePropertyInvitationVerificationTokenFunction => async (
    userEmail,
    propertyId,
    tokenSize,
    expiryTimeDays,
) => {
  tokenSize = tokenSize ?? DEFAULT_TOKEN_SIZE;
  expiryTimeDays = expiryTimeDays ?? DEFAULT_TOKEN_EXPIRY_TIME_DAYS;
  const propertyInvitationVerificationToken = await PropertyInvitationVerificationToken.create({
    id: await generateId(),
    value: randomBytes(tokenSize / 2).toString(DEFAULT_TOKEN_BUFFER_ENCODING),
    propertyId,
    expiryDate: addDays(new Date(), expiryTimeDays),
    userEmail,
    isAccepted: false,
  });

  logger.info(`Generated property invitation verification token for user e-mail: <${userEmail}> and property ID: ${propertyId}`);
  return propertyInvitationVerificationToken;
};