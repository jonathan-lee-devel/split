import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {defaultRateLimiter} from '@split-common/split-service-config';
import {Router} from 'express';
import passport from 'passport';

import {getTokenFromTokenHoldHandler, loginHandler, registerHandler} from './controllers/auth';
import {indexHealthCheckHandler} from './controllers/health';
import {getProfileHandler} from './controllers/profile';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Registration Endpoints
router.post('/register', defaultRateLimiter, registerHandler);
router.post('/login', defaultRateLimiter, loginHandler);
router.post('/token-code', defaultRateLimiter, getTokenFromTokenHoldHandler);

// Protected Routes Example
router.get('/profile', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getProfileHandler as any);

export default router;
