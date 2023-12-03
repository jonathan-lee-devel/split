import {Router} from 'express';
import {indexHealthCheckHandler} from './controllers/health';
import passport from 'passport';
import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import logger from './logger';
import {HttpStatus} from '@split-common/split-http';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Protected Routes Example
router.get('/properties',
    passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}),
    (req, res) => {
      // @ts-ignore
      logger.info(`req.user.email = ${req.user.email}`);
      return res.status(HttpStatus.CREATED).json({test: 'success'});
    });

export default router;
