import {Router} from 'express';

import {indexHealthCheckHandler} from './controllers/health';

const router = Router();

// Health Check Routes
router.get('/', indexHealthCheckHandler);

export default router;
