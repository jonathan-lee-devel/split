import {AnonymousController, HttpStatus, StatusDataContainer} from '@split-common/split-http';
import winston from 'winston';

import {TokenResponseDto} from '../dtos';
import {LoginRequestBody, LoginRequestHeaders, LoginRequestParams, LoginRequestQuery} from '../schemas';
import {AuthService} from '../services';

export const makeLoginController = (
    logger: winston.Logger,
    authService: AuthService,
): AnonymousController<
  LoginRequestBody,
  LoginRequestParams,
  LoginRequestQuery,
  LoginRequestHeaders,
  TokenResponseDto> =>
  async (body) => {
    const {email, password} = body;
    logger.info(`Anonymous request to log in with e-mail: <${email}>`);

    const userVerificationResponse = await authService.verifyUserLoginDetails(email, password);
    if (userVerificationResponse.status !== HttpStatus.OK) {
      return userVerificationResponse as StatusDataContainer<TokenResponseDto>; // Will contain status and error, data undefined
    }

    const generateTokensResponse = await authService
        .generateLoginTokens(userVerificationResponse.data!.user); // Known to be defined if status OK

    return (generateTokensResponse.status === HttpStatus.OK) ?
      {status: HttpStatus.OK, data: generateTokensResponse.data} :
      {status: HttpStatus.UNAUTHORIZED};
  };
