import {makeMakeRegisterUserEndpoint} from './endpoionts/register-user';
import {returnAnonymouslyBasedOnSafeParseResult} from '../../lib/endpoint-util';
import {RegisterUserRequestBodySchema, RegisterUserRequestQuerySchema} from './schemas/register-user';
import {makeRegisterUserCallback} from './callbacks/register-user';
import logger from '../../logger';
import {
  encodePassword,
  generatePasswordResetVerificationToken,
  generateRegistrationVerificationToken,
  handleExistingUser,
  sendMail,
} from '../../util';
import {UserModel} from '../../models/users/User';
import {environment} from '../../environment';
import {makeMakeConfirmRegistrationEndpoint} from './endpoionts/confirm-registration';
import {ConfirmRegistrationRequestBodySchema, ConfirmRegistrationRequestQuerySchema} from './schemas/confirm-registration';
import {makeConfirmRegistrationCallback} from './callbacks/confirm-registration';
import {RegistrationVerificationTokenModel} from '../../models/users/registration/RegistrationVerificationToken';

export const registerUserHandler = makeMakeRegisterUserEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    RegisterUserRequestBodySchema,
    RegisterUserRequestQuerySchema,
    makeRegisterUserCallback(
        logger,
        handleExistingUser,
        generateRegistrationVerificationToken,
        generatePasswordResetVerificationToken,
        encodePassword,
        UserModel,
        sendMail,
        environment),
);

export const confirmRegistrationHandler = makeMakeConfirmRegistrationEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    ConfirmRegistrationRequestBodySchema,
    ConfirmRegistrationRequestQuerySchema,
    makeConfirmRegistrationCallback(
        logger,
        UserModel,
        RegistrationVerificationTokenModel,
    ),
);
