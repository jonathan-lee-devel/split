import {makeGenerateId} from '@split-common/split-auth';

import {makeGeneratePropertyInvitationVerificationToken} from './property/generate-property-invitation-verification-token';
import logger from '../logger';
import {PropertyInvitationVerificationTokenModel} from '../models';

export const generatePropertyInvitationVerificationToken = makeGeneratePropertyInvitationVerificationToken(
    logger,
    PropertyInvitationVerificationTokenModel,
    makeGenerateId(logger),
);
