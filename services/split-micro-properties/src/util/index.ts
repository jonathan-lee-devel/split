import {makeGeneratePropertyInvitationVerificationToken} from './property/generate-property-invitation-verification-token';
import logger from '../logger';
import {PropertyInvitationVerificationTokenModel} from '../models/property/PropertyInvitationVerificationToken';

export const generatePropertyInvitationVerificationToken = makeGeneratePropertyInvitationVerificationToken(
    logger,
    PropertyInvitationVerificationTokenModel,
);
