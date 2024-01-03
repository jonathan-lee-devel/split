import {AnonymousController} from '@split-common/split-http';
import winston from 'winston';

import {SimpleStatusDto} from '../dtos';
import {
  ConfirmPasswordResetRequestBody,
  ConfirmPasswordResetRequestHeaders,
  ConfirmPasswordResetRequestParams,
  ConfirmPasswordResetRequestQuery,
} from '../schemas';
import {UserPasswordService} from '../services';

export const makeConfirmPasswordResetController = (
    logger: winston.Logger,
    userPasswordService: UserPasswordService,
): AnonymousController<
  ConfirmPasswordResetRequestBody,
  ConfirmPasswordResetRequestParams,
  ConfirmPasswordResetRequestQuery,
  ConfirmPasswordResetRequestHeaders,
  SimpleStatusDto> =>
  async (body) => {
    const {tokenValue, password} = body;
    logger.info(`Anonymous request to confirm password reset with token value: ${tokenValue}`);

    return await userPasswordService.confirmUserPasswordReset(password, tokenValue);
  };
