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
router.post('/users/register', defaultRateLimiter, registerHandler);
router.post('/users/login', defaultRateLimiter, loginHandler);
router.post('/users/token-code', defaultRateLimiter, getTokenFromTokenHoldHandler);

// Protected Routes Example
router.get('/users/profile', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getProfileHandler as any);

export default router;
