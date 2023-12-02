import {Model} from 'mongoose';
import isAfter from 'date-fns/isAfter';
import {GetTokenFromTokenHoldRequestBody, GetTokenFromTokenHoldRequestQuery} from '../schemas/get-token-from-token-hold';
import {AnonymousEndpointCallback, HttpStatus} from '@split/split-http';
import {TokenHold} from '@split/split-auth';

export const makeGetTokenFromTokenHoldCallback = (
    TokenHold: Model<TokenHold>,
): AnonymousEndpointCallback<GetTokenFromTokenHoldRequestBody, GetTokenFromTokenHoldRequestQuery> => async (req, res) => {
  const {tokenCode} = req.body;

  const tokenHold = await TokenHold.findOne({tokenCode}).exec();
  if (!tokenHold) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  if (isAfter(new Date(), tokenHold.expiryDate)) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  return res.status(HttpStatus.OK).json({token: tokenHold.token});
};
