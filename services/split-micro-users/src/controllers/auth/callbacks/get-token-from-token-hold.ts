import {Model} from 'mongoose';
import {TokenHold} from '../../../models/tokens/TokenHold';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {GetTokenFromTokenHoldRequestBody, GetTokenFromTokenHoldRequestQuery} from '../schemas/get-token-from-token-hold';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import isAfter from 'date-fns/isAfter';

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
