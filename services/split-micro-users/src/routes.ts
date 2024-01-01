import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {defaultRateLimiter} from '@split-common/split-service-config';
import {Router} from 'express';
import passport from 'passport';

import {confirmRegistrationHandler, getTokenFromTokenHoldHandler} from './controllers/auth';
import {indexHealthCheckHandler} from './controllers/health';
import {getProfileHandler} from './controllers/profile';
import {loginHandler} from './express-callbacks';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler as any);

// Registration Endpoints
// router.post('/register', defaultRateLimiter, registerUserHandler as any);
router.post('/register/confirm', defaultRateLimiter, confirmRegistrationHandler as any);

// Login Endpoints
router.post('/login', defaultRateLimiter, loginHandler);
router.post('/token-code', defaultRateLimiter, getTokenFromTokenHoldHandler as any);

// Password Endpoints
// router.post('/password/reset', defaultRateLimiter, resetPasswordHandler as any);
// router.post('/password/reset/confirm', defaultRateLimiter, confirmPasswordResetHandler as any);

// Protected Routes Example
router.get('/profile', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getProfileHandler as any);

export default router;
