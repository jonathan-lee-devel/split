import winston from 'winston';
import {Model} from 'mongoose';
import {User} from '../../../models/users/User';
import {ModelTransformFunction} from '../../../lib/model-transform/default-model-transform';
import {AuthenticatedEndpointCallback} from '../../../lib/endpoint-util';
import {GetProfileRequestBody, GetProfileRequestQuery} from '../schems/get-profile';
import {HttpStatus} from '../../../lib/enums/HttpStatus';

export const makeGetProfileCallback = (
    logger: winston.Logger,
    User: Model<User>,
    transform: ModelTransformFunction,
): AuthenticatedEndpointCallback<GetProfileRequestBody, GetProfileRequestQuery> => async (req, res) => {
  const requestingUserEmail = req.user.email;
  const user = await User.findOne({email: requestingUserEmail}).exec();
  if (!user) {
    logger.error(`No user profile found for logged in user: <${requestingUserEmail}>`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }

  return res.status(HttpStatus.OK).json({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });
};
