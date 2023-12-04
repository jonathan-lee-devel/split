import {Router} from 'express';
import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {indexHealthCheckHandler} from './controllers/health';
import {getTokenFromTokenHoldHandler} from './controllers/auth';
import passport from 'passport';
import {getProfileHandler} from './controllers/profile';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Authentication Endpoints
router.post('/users/token-code', getTokenFromTokenHoldHandler);

// Protected Routes Example
router.get('/users/profile', passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getProfileHandler);

export default router;
