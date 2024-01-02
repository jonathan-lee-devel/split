import {AnonymousController} from '@split-common/split-http';
import winston from 'winston';

import {TokenResponseDto} from '../dtos';
import {
  GetTokenFromTokenHoldRequestBody,
  GetTokenFromTokenHoldRequestHeaders,
  GetTokenFromTokenHoldRequestParams,
  GetTokenFromTokenHoldRequestQuery,
} from '../schemas';
import {TokenHoldService} from '../services';

export const makeGetTokenFromTokenHoldController = (
    logger: winston.Logger,
    tokenHoldService: TokenHoldService,
): AnonymousController<
  GetTokenFromTokenHoldRequestBody,
  GetTokenFromTokenHoldRequestParams,
  GetTokenFromTokenHoldRequestQuery,
  GetTokenFromTokenHoldRequestHeaders,
  TokenResponseDto> =>
  async (body) => {
    const {tokenCode} = body;
    logger.info(`Anonymous request get token hold with code: ${tokenCode}`);

    return await tokenHoldService.getTokenFromTokenHold(tokenCode);
  };
