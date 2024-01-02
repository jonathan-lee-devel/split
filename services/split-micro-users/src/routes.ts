import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {buildIndexHealthCheckHandler} from '@split-common/split-http';
import {defaultRateLimiter} from '@split-common/split-service-config';
import {Router} from 'express';
import passport from 'passport';

import {getProfileHandler, getTokenFromTokenHoldHandler, loginHandler, registerHandler} from './express-callbacks';
import logger from './logger';

const router = Router();

const indexHealthCheckHandler = buildIndexHealthCheckHandler(logger);

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Registration Endpoints
router.post('/register', defaultRateLimiter, registerHandler);
// router.post('/register/confirm', defaultRateLimiter, confirmRegistrationHandler as any);

// Login Endpoints
router.post('/login', defaultRateLimiter, loginHandler);
router.post('/token-code', defaultRateLimiter, getTokenFromTokenHoldHandler);

// Password Endpoints
// router.post('/password/reset', defaultRateLimiter, resetPasswordHandler as any);
// router.post('/password/reset/confirm', defaultRateLimiter, confirmPasswordResetHandler as any);

// Protected Routes Example
router.get('/profile', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getProfileHandler);

export default router;
