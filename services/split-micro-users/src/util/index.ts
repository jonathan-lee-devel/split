import {
  makeGenerateId,
  PasswordResetVerificationTokenModel,
  RegistrationVerificationTokenModel,
  UserModel,
} from '@split/split-auth';
import {EmailSendAttemptModel, makeSendMail, transporterConfig} from '@split/split-mail';
import logger from '../logger';
import {environment} from '../environment';
import {makeGenerateRegistrationVerificationToken} from './registration/generate-registration-verification-token';
import {makeEncodePassword} from './password/encode-password';
import {makeGenerateSalt} from './password/generate-salt';
import {makeGeneratePasswordResetVerificationToken} from './password/generate-password-reset-verification-token';
import {makeHandleExistingUser} from './registration/handle-existing-user';

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
