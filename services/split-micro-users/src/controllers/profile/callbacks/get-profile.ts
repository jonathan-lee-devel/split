import winston from 'winston';
import {Model} from 'mongoose';
import {User} from '@split-common/split-auth';
import {AuthenticatedEndpointCallback, HttpStatus} from '@split-common/split-http';
import {GetProfileRequestBody, GetProfileRequestQuery} from '../schemas/get-profile';

export const makeGetProfileCallback = (
    logger: winston.Logger,
    User: Model<User>,
): AuthenticatedEndpointCallback<GetProfileRequestBody, GetProfileRequestQuery> => async (req, res) => {
  logger.silly(`req.user = ${JSON.stringify(req.user)}`);
  const user = await User.findOne({email: req.user.email});
  if (!user) {
    logger.error(`req.user.email query returned null for user ${JSON.stringify(req.user)}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }
  return res.status(HttpStatus.OK).json({email: user.email, firstName: user.firstName, lastName: user.lastName});
};
