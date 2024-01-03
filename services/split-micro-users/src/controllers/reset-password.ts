import {AnonymousController, StatusDataContainer} from '@split-common/split-http';
import winston from 'winston';

import {SimpleStatusDto} from '../dtos';
import {ResetPasswordRequestBody, ResetPasswordRequestHeaders, ResetPasswordRequestParams, ResetPasswordRequestQuery} from '../schemas';
import {UserPasswordService} from '../services';

export const makeResetPasswordController = (
    logger: winston.Logger,
    userPasswordService: UserPasswordService,
): AnonymousController<
  ResetPasswordRequestBody,
  ResetPasswordRequestParams,
  ResetPasswordRequestQuery,
  ResetPasswordRequestHeaders,
  SimpleStatusDto> =>
  async (body) => {
    const {email} = body;
    logger.info(`Anonymous request to reset password with e-mail: <${email}>`);

    // Known to not return token data
    return await userPasswordService.resetUserPassword(email) as StatusDataContainer<SimpleStatusDto>;
  };
