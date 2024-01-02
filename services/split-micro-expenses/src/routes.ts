import {Router} from 'express';

import {indexHealthCheckHandler} from './controllers/health';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Protected Routes
// router.post('/', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), createExpenseHandler as any);
// router.get('/id/:expenseId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getExpenseByIdHandler as any);
// router.delete('/id/:expenseId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), deleteExpenseByIdHandler as any);
// router.get('/for-property/:propertyId', defaultRateLimiter, passport.authenticate(JWT_AUTHENTICATION_STRATEGY, {session: false}), getExpensesForPropertyHandler as any);

export default router;
