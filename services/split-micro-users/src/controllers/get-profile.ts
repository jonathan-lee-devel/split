import {AuthenticatedController} from '@split-common/split-http';
import winston from 'winston';

import {UserProfileDto} from '../dtos';
import {GetProfileRequestBody, GetProfileRequestHeaders, GetProfileRequestParams, GetProfileRequestQuery} from '../schemas';
import {UserService} from '../services';

export const makeGetProfileController = (
    logger: winston.Logger,
    userService: UserService,
): AuthenticatedController<
  GetProfileRequestBody,
  GetProfileRequestParams,
  GetProfileRequestQuery,
  GetProfileRequestHeaders,
  UserProfileDto> =>
  async (requestingUserEmail) => {
    logger.info(`Request to get user profile for: <${requestingUserEmail}>`);
    return await userService.getUserProfile(requestingUserEmail);
  };
