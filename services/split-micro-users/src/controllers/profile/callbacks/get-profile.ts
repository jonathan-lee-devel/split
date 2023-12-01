import winston from 'winston';
import {Model} from 'mongoose';
import {User} from '@split/split-auth-config';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {HttpStatus} from '../../../lib/enums/HttpStatus';
import {GetProfileRequestBody, GetProfileRequestQuery} from '../schemas/get-profile';

export const makeGetProfileCallback = (
    logger: winston.Logger,
    User: Model<User>,
): AuthenticatedEndpointCallback<GetProfileRequestBody, GetProfileRequestQuery> => async (req, res) => {
  const user = await User.findOne({email: req.user.email});
  if (!user) {
    logger.error(`req.user.email query returned null for user ${JSON.stringify(req.user)}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
  return res.status(HttpStatus.OK).json({email: user.email, firstName: user.firstName, lastName: user.lastName});
};
