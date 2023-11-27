import {transporterConfig} from '../lib/nodemailer-transporter';
import {makeSendMail} from './email/send-mail';
import logger from '../logger';
import {EmailSendAttemptModel} from '../models/email/EmailSendAttempt';
import {generateId} from '../lib/generate-id';
import {environment} from '../environment';
import {makeGenerateRegistrationVerificationToken} from './registration/generate-registration-verification-token';
import {RegistrationVerificationTokenModel} from '../models/users/registration/RegistrationVerificationToken';
import {makeEncodePassword} from './password/encode-password';
import {makeGenerateSalt} from './password/generate-salt';
import {makeGeneratePasswordResetVerificationToken} from './password/generate-password-reset-verification-token';
import {PasswordResetVerificationTokenModel} from '../models/users/password/PasswordResetVerificationToken';
import {makeHandleExistingUser} from './registration/handle-existing-user';
import {UserModel} from '../models/users/User';

const transporter = transporterConfig();

export const sendMail = makeSendMail(
    environment,
    logger,
    EmailSendAttemptModel,
    generateId,
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
