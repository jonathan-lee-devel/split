import {makeMakeResetPasswordEndpoint} from './endpoints/reset-password';
import {returnAnonymouslyBasedOnSafeParseResult} from '../../lib/endpoint-util';
import {ResetPasswordRequestBodySchema, ResetPasswordRequestQuerySchema} from './schemas/reset-password';
import {makeResetPasswordCallback} from './callbacks/reset-password';
import logger from '../../logger';
import {UserModel} from '../../models/users/User';
import {PasswordResetVerificationTokenModel} from '../../models/users/password/PasswordResetVerificationToken';
import {encodePassword, generatePasswordResetVerificationToken, sendMail} from '../../util';
import {environment} from '../../environment';
import {makeMakeConfirmPasswordResetEndpoint} from './endpoints/confirm-password-reset';
import {ConfirmPasswordResetRequestBodySchema, ConfirmPasswordResetRequestQuerySchema} from './schemas/confirm-password-reset';
import {makeConfirmPasswordResetCallback} from './callbacks/confirm-password-reset';

export const resetPasswordHandler = makeMakeResetPasswordEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    ResetPasswordRequestBodySchema,
    ResetPasswordRequestQuerySchema,
    makeResetPasswordCallback(
        logger,
        UserModel,
        PasswordResetVerificationTokenModel,
        generatePasswordResetVerificationToken,
        sendMail,
        environment,
    ),
);

export const confirmPasswordResetHandler = makeMakeConfirmPasswordResetEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    ConfirmPasswordResetRequestBodySchema,
    ConfirmPasswordResetRequestQuerySchema,
    makeConfirmPasswordResetCallback(
        logger,
        PasswordResetVerificationTokenModel,
        UserModel,
        encodePassword,
    ),
);
