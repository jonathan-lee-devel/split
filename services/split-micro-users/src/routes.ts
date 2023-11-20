import {Router} from 'express';
import {indexHealthCheckHandler} from './controllers/health';
import {loginHandler, registerHandler} from './controllers/auth';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Registration Endpoints
router.post('/users/register', registerHandler);
router.post('/users/login', loginHandler);

// Protected Routes Example
// router.get('/protected', passport.authenticate('jwt', {session: false}), endpointHandler);

export default router;
