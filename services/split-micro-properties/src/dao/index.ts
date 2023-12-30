import {defaultModelTransform} from '@split-common/split-service-config';

import {PropertyDAO} from './PropertyDAO';
import {PropertyInvitationVerificationTokenDAO} from './PropertyInvitationVerificationTokenDAO';
import {PropertyInvitationVerificationTokenModel, PropertyModel} from '../models';

export * from './PropertyDAO';
export * from './PropertyInvitationVerificationTokenDAO';

export const makeDefaultPropertyDao = () => new PropertyDAO(PropertyModel, defaultModelTransform);

export const makeDefaultPropertyInvitationVerificationTokenDao = () => new PropertyInvitationVerificationTokenDAO(
    PropertyInvitationVerificationTokenModel,
    defaultModelTransform,
);
