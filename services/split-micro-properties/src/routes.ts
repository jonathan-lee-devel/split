import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {buildIndexHealthCheckHandler} from '@split-common/split-http';
import {defaultRateLimiter} from '@split-common/split-service-config';
import {Router} from 'express';
import passport from 'passport';

import {
  acceptTenantInvitationHandler,
  createPropertyHandler,
  deletePropertyByIdHandler,
  getPropertiesWhereInvolvedHandler,
  getPropertyByIdHandler,
  inviteTenantToPropertyHandler,
  togglePropertyAdministratorStatusHandler,
  togglePropertyTenantStatusHandler,
} from './express-callbacks';
import logger from './logger';

const router = Router();

const indexHealthCheckHandler = buildIndexHealthCheckHandler(logger);

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Anonymous Routes
router.patch('/id/:propertyId/accept-invitation', defaultRateLimiter, acceptTenantInvitationHandler);

// Protected Routes
router.post('/', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), createPropertyHandler);
router.get('/id/:propertyId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getPropertyByIdHandler);
router.get('/where-involved', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getPropertiesWhereInvolvedHandler);
router.delete('/id/:propertyId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), deletePropertyByIdHandler);
router.patch('/id/:propertyId/toggle-property-admin', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), togglePropertyAdministratorStatusHandler);
router.patch('/id/:propertyId/toggle-property-tenant', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), togglePropertyTenantStatusHandler);
router.patch('/id/:propertyId/invite-tenant', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), inviteTenantToPropertyHandler);

export default router;
