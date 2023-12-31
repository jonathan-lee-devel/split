import {makeGenerateId} from '@split-common/split-auth';
import {makeHandleUnhandledControllerError} from '@split-common/split-http';

import {makeGeneratePropertyInvitationVerificationToken} from './property/generate-property-invitation-verification-token';
import logger from '../logger';
import {PropertyInvitationVerificationTokenModel} from '../models';

export const handleUnhandledControllerError = makeHandleUnhandledControllerError(logger);

export const generatePropertyInvitationVerificationToken = makeGeneratePropertyInvitationVerificationToken(
    logger,
    PropertyInvitationVerificationTokenModel,
    makeGenerateId(logger),
);
