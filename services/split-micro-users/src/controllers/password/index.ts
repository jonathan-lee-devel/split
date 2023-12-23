import {MailToSendMessage} from '@split-common/split-constants';
import {returnAnonymouslyBasedOnSafeParseResult} from '@split-common/split-http';

import {makeConfirmPasswordResetCallback} from './callbacks/confirm-password-reset';
import {makeResetPasswordCallback} from './callbacks/reset-password';
import {makeMakeConfirmPasswordResetEndpoint} from './endpoints/confirm-password-reset';
import {makeMakeResetPasswordEndpoint} from './endpoints/reset-password';
import {ConfirmPasswordResetRequestBodySchema, ConfirmPasswordResetRequestQuerySchema} from './schemas/confirm-password-reset';
import {ResetPasswordRequestBodySchema, ResetPasswordRequestQuerySchema} from './schemas/reset-password';
import {environment} from '../../environment';
import logger from '../../logger';
import {PasswordResetVerificationTokenModel, UserModel} from '../../models';
import {makeMailToSendRabbitMQConnection} from '../../rabbitmq';
import {encodePassword, generatePasswordResetVerificationToken} from '../../util';

const rabbitMQConnection = makeMailToSendRabbitMQConnection<MailToSendMessage>(logger, environment.RABBITMQ_URL);

export const resetPasswordHandler = makeMakeResetPasswordEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    ResetPasswordRequestBodySchema,
    ResetPasswordRequestQuerySchema,
    makeResetPasswordCallback(
        logger,
        UserModel,
        PasswordResetVerificationTokenModel,
        generatePasswordResetVerificationToken,
        rabbitMQConnection,
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
