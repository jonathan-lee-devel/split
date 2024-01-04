import {JWT_AUTHENTICATION_STRATEGY} from '@split-common/split-constants';
import {buildIndexHealthCheckHandler} from '@split-common/split-http';
import {defaultRateLimiter} from '@split-common/split-service-config';
import {Router} from 'express';
import passport from 'passport';

import {createExpenseHandler, getExpenseByIdHandler} from './express-callbacks';
import logger from './logger';

const router = Router();

const indexHealthCheckHandler = buildIndexHealthCheckHandler(logger);

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Protected Routes
router.post('/', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), createExpenseHandler);
router.get('/id/:expenseId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getExpenseByIdHandler);
// router.delete('/id/:expenseId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), deleteExpenseByIdHandler as any);
// router.get('/for-property/:propertyId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getExpensesForPropertyHandler as any);

export default router;
