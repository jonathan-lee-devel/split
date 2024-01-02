import winston from 'winston';

import {makeIndexHealthCheckController} from './controllers/index-health-check';
import {makeIndexHealthCheckHandler} from './express-callbacks/index-health-check';
import {makeHandleUnhandledControllerError} from '../common-util';
import {executeAnonymousController} from '../endpoint-util';

const indexHealthCheckController = makeIndexHealthCheckController();

export const buildIndexHealthCheckHandler = (logger: winston.Logger) => makeIndexHealthCheckHandler(
    makeHandleUnhandledControllerError(logger),
    executeAnonymousController,
    indexHealthCheckController,
);
