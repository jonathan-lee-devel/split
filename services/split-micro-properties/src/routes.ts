import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {defaultRateLimiter} from '@split-common/split-service-config';
import {Router} from 'express';
import passport from 'passport';

import {indexHealthCheckHandler} from './controllers/health';
import {createPropertyHandler} from './controllers/properties';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Protected Routes
router.post('/properties', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), createPropertyHandler as any);

export default router;
