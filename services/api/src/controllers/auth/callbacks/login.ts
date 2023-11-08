import winston from 'winston';
import passport from 'passport';
import {User} from '../../../models/users/User';
import {AnonymousEndpointCallback} from '../../../lib/endpoint-util';
import {LoginRequestBody, LoginRequestQuery} from '../schemas/login';
import {HttpStatus} from '../../../lib/enums/HttpStatus';

export const makeLoginCallback = (
    passport: passport.PassportStatic,
    logger: winston.Logger,
): AnonymousEndpointCallback<LoginRequestBody, LoginRequestQuery> => async (req, res, next) => {
  passport.authenticate('local', (err: any, user: User, _: any) => {
    if (!next) {
      throw Error('No next function provided for passport authentication');
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({loginStatus: 'FAILURE'});
    }

    req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      logger.info(`Successful login for user with e-mail: <${user.email}>`);
      return res.status(HttpStatus.OK).json({
        loginStatus: 'SUCCESS',
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};
