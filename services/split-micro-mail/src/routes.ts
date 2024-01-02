import {buildIndexHealthCheckHandler} from '@split-common/split-http';
import {Router} from 'express';

import logger from './logger';

const router = Router();

const indexHealthCheckHandler = buildIndexHealthCheckHandler(logger);

// Health Check Routes
router.get('/', indexHealthCheckHandler);

export default router;
