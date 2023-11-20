import {Router} from 'express';
import {indexHealthCheckHandler} from './controllers/health';
import {getTokenFromTokenHoldHandler, loginHandler, registerHandler} from './controllers/auth';
import passport from 'passport';
import {HttpStatus} from './lib/enums/HttpStatus';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

// Registration Endpoints
router.post('/users/register', registerHandler);
router.post('/users/login', loginHandler);
router.post('/users/token-code', getTokenFromTokenHoldHandler);

// Protected Routes Example
router.get('/users/protected', passport.authenticate('jwt', {session: false}), async (req, res) => {
  return res.status(HttpStatus.OK).json({content: 'Protected'});
});

export default router;
