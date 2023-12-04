import {Router} from 'express';
import {indexHealthCheckHandler} from './controllers/health';
import passport from 'passport';
import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {createPropertyHandler} from './controllers/properties';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Protected Routes
router.post('/properties', passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), createPropertyHandler as any);

export default router;
