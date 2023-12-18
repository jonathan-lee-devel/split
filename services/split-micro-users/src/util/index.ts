import {makeGenerateId} from '@split-common/split-auth';
import {EmailSendAttemptModel, makeSendMail, transporterConfig} from '@split-common/split-mail';

import {makeEncodePassword} from './password/encode-password';
import {makeGeneratePasswordResetVerificationToken} from './password/generate-password-reset-verification-token';
import {makeGenerateSalt} from './password/generate-salt';
import {makeGenerateRegistrationVerificationToken} from './registration/generate-registration-verification-token';
import {makeHandleExistingUser} from './registration/handle-existing-user';
import {environment} from '../environment';
import logger from '../logger';
import {PasswordResetVerificationTokenModel, RegistrationVerificationTokenModel, UserModel} from '../models';

const transporter = transporterConfig();

export const sendMail = makeSendMail(
    environment,
    logger,
    EmailSendAttemptModel,
    makeGenerateId(logger),
    transporter,
);

export const generateRegistrationVerificationToken = makeGenerateRegistrationVerificationToken(
    logger,
    RegistrationVerificationTokenModel,
);

export const generatePasswordResetVerificationToken = makeGeneratePasswordResetVerificationToken(
    logger,
    PasswordResetVerificationTokenModel,
);

export const handleExistingUser = makeHandleExistingUser(
    logger,
    UserModel,
    RegistrationVerificationTokenModel,
    PasswordResetVerificationTokenModel,
);

const generateSalt = makeGenerateSalt();

export const encodePassword = makeEncodePassword(generateSalt);
