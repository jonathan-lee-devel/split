import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {defaultRateLimiter} from '@split-common/split-service-config';
import {Router} from 'express';
import passport from 'passport';

import {indexHealthCheckHandler} from './controllers/health';
import {
  createPropertyHandler,
  deletePropertyByIdHandler,
  getPropertiesWhereInvolvedHandler,
  getPropertyByIdHandler,
} from './controllers/properties';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Protected Routes
router.post('/', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), createPropertyHandler as any);
router.get('/id/:propertyId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getPropertyByIdHandler as any);
router.get('/where-involved', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getPropertiesWhereInvolvedHandler as any);
router.delete('/id/:propertyId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), deletePropertyByIdHandler as any);

export default router;
