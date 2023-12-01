import {Router} from 'express';
import {indexHealthCheckHandler} from './controllers/health';
import {getTokenFromTokenHoldHandler, loginHandler, registerHandler} from './controllers/auth';
import passport from 'passport';
import {getProfileHandler} from './controllers/profile';
import {JWT_AUTHENTICATION_STRATEGY} from '@split/split-constants';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Registration Endpoints
router.post('/users/register', registerHandler);
router.post('/users/login', loginHandler);
router.post('/users/token-code', getTokenFromTokenHoldHandler);

// Protected Routes Example
router.get('/users/profile', passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getProfileHandler);

export default router;
