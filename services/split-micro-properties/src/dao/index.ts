import {makeDefaultPropertyDao} from './PropertyDAO';
import {makeDefaultPropertyInvitationVerificationTokenDao} from './PropertyInvitationVerificationTokenDAO';

export * from './PropertyDAO';
export * from './PropertyInvitationVerificationTokenDAO';

export const defaultPropertyDao = makeDefaultPropertyDao();

export const defaultPropertyInvitationTokenDao = makeDefaultPropertyInvitationVerificationTokenDao();
