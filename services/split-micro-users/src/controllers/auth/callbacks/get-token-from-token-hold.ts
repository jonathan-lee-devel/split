import {TokenHold} from '@split-common/split-auth';
import {AnonymousEndpointCallback, HttpStatus, wrapTryCatchAnonymous} from '@split-common/split-http';
import {isAfter} from 'date-fns/isAfter';
import {Model} from 'mongoose';

import {GetTokenFromTokenHoldRequestBody, GetTokenFromTokenHoldRequestQuery} from '../schemas/get-token-from-token-hold';

export const makeGetTokenFromTokenHoldCallback = (
    TokenHold: Model<TokenHold>,
): AnonymousEndpointCallback<GetTokenFromTokenHoldRequestBody, GetTokenFromTokenHoldRequestQuery> =>
  wrapTryCatchAnonymous<GetTokenFromTokenHoldRequestBody, GetTokenFromTokenHoldRequestQuery>(async (req, res) => {
    const {tokenCode} = req.body;

    const tokenHold = await TokenHold.findOne({tokenCode}).exec();
    if (!tokenHold) {
      return res.status(HttpStatus.UNAUTHORIZED).send();
    }

    if (isAfter(new Date(), tokenHold.expiryDate)) {
      return res.status(HttpStatus.UNAUTHORIZED).send();
    }

    return res.status(HttpStatus.OK).json({token: tokenHold.token, refreshToken: tokenHold.refreshToken});
  }) as any;
