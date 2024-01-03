import {AnonymousController} from '@split-common/split-http';
import winston from 'winston';

import {SimpleStatusDto} from '../dtos';
import {
  ConfirmRegistrationRequestBody,
  ConfirmRegistrationRequestHeaders,
  ConfirmRegistrationRequestParams,
  ConfirmRegistrationRequestQuery,
} from '../schemas/confirm-registration';
import {RegisterService} from '../services';

export const makeConfirmRegistrationController = (
    logger: winston.Logger,
    registerService: RegisterService,
): AnonymousController<
  ConfirmRegistrationRequestBody,
  ConfirmRegistrationRequestParams,
  ConfirmRegistrationRequestQuery,
  ConfirmRegistrationRequestHeaders,
  SimpleStatusDto> =>
  async (body) => {
    const {tokenValue} = body;
    logger.info(`Anonymous request to confirm registration with token value: ${tokenValue}`);

    return await registerService.confirmRegistration(tokenValue);
  };
