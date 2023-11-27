import {Router} from 'express';
import {indexHealthCheckHandler} from './controllers/health';
import {getTokenFromTokenHoldHandler, loginHandler, registerHandler} from './controllers/auth';
import passport from 'passport';
import {HttpStatus} from './lib/enums/HttpStatus';
import logger from './logger';
import {UserModel} from './models/users/User';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Registration Endpoints
router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/token-code', getTokenFromTokenHoldHandler);

// Protected Routes Example
router.get('/profile', passport.authenticate('jwt', {session: false}),
    async (req, res) => {
      logger.silly(`/users/profile req.user = ${JSON.stringify(req.user)}`);
      const user = await UserModel.findOne({
        // @ts-ignore
        email: req.user.email,
      });
      if (!user) {
        logger.error(`req.user.email query returned null for user ${JSON.stringify(req.user)}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
      }
      logger.silly(`Profile query got user: ${JSON.stringify(user)}`);
      return res.status(HttpStatus.OK).json({email: user.email, firstName: user.firstName, lastName: user.lastName});
    });

router.get('/test', passport.authenticate('jwt', {session: false}),
    async (req, res) => {
      logger.info(`req.user: ${JSON.stringify(req.user)}`);
      return res.status(HttpStatus.OK).json({content: 'Hello'});
    });

export default router;
