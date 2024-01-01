import {makeHandleUnhandledControllerError} from '@split-common/split-http';

import logger from './logger';

export const handleUnhandledControllerError = makeHandleUnhandledControllerError(logger);
