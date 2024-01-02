import {RegistrationStatus} from '@split-common/split-constants';
import {AnonymousController, HttpStatus} from '@split-common/split-http';
import winston from 'winston';

import {RegistrationStatusDto} from '../dtos';
import {RegisterRequestBody, RegisterRequestHeaders, RegisterRequestParams, RegisterRequestQuery} from '../schemas/register';
import {MailService, RegisterService, TokenService, UserService} from '../services';

export const makeRegisterController = (
    logger: winston.Logger,
    userService: UserService,
    registerService: RegisterService,
    tokenService: TokenService,
    mailService: MailService,
): AnonymousController<
  RegisterRequestBody,
  RegisterRequestParams,
  RegisterRequestQuery,
  RegisterRequestHeaders,
  RegistrationStatusDto> =>
  async (body) => {
    const {email, firstName, lastName, password} = body;
    const handleExistingResponse = await userService.handleExistingUser(email);
    if (handleExistingResponse.status !== HttpStatus.OK) {
      return handleExistingResponse;
    }
    const registerResponse = await registerService.registerUser(email, firstName, lastName, password);
    if (registerResponse.data === null) { // null implies failure with DAO call
      return {status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Error registering user with e-mail: ${email}`};
    }
    const tokenGenerationResponse = await tokenService.generateRegistrationVerificationToken(email);
    if (tokenGenerationResponse.status !== HttpStatus.OK) {
      return tokenGenerationResponse;
    }
    await mailService.sendRegistrationVerificationEmail(email, tokenGenerationResponse.data!.token); // Known to be defined if status OK
    logger.info(`Registration status successfully initiated for <${email}>`);
    return {status: HttpStatus.OK, data: {status: RegistrationStatus[RegistrationStatus.AWAITING_EMAIL_VERIFICATION]}};
  };
