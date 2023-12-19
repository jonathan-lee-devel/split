import {makeEncodePassword} from './password/encode-password';
import {makeGeneratePasswordResetVerificationToken} from './password/generate-password-reset-verification-token';
import {makeGenerateSalt} from './password/generate-salt';
import {makeGenerateRegistrationVerificationToken} from './registration/generate-registration-verification-token';
import {makeHandleExistingUser} from './registration/handle-existing-user';
import logger from '../logger';
import {PasswordResetVerificationTokenModel, RegistrationVerificationTokenModel, UserModel} from '../models';

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
