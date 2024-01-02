import {HttpStatus} from '@split-common/split-http';
import {isAfter} from 'date-fns/isAfter';

import {TokenHoldDAO} from '../dao';

export const makeTokenHoldService = (
    tokenHoldDao: TokenHoldDAO,
) => {
  return {
    getTokenFromTokenHold: async (tokenCode: string) => {
      const tokenHold = await tokenHoldDao.getOneTransformed({tokenCode});
      return (!tokenHold || isAfter(new Date(), tokenHold.expiryDate)) ?
        {status: HttpStatus.UNAUTHORIZED} :
        {status: HttpStatus.OK, data: {
          token: tokenHold.token,
          refreshToken: tokenHold.refreshToken,
        }};
    },
  };
};
