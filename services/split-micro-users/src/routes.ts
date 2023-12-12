import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {Router} from 'express';
import passport from 'passport';

import {getTokenFromTokenHoldHandler, loginHandler, registerHandler} from './controllers/auth';
import {indexHealthCheckHandler} from './controllers/health';
import {getProfileHandler} from './controllers/profile';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Registration Endpoints
router.post('/users/register', registerHandler);
router.post('/users/login', loginHandler);
router.post('/users/token-code', getTokenFromTokenHoldHandler);

// Protected Routes Example
router.get('/users/profile', passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getProfileHandler as any);

export default router;
