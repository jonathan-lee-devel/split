import {createApplicationLogger} from '@split-common/split-observability';

import {environment} from './environment';

const logger = (environment.NODE_ENV === 'development') ?
  createApplicationLogger(environment.NODE_ENV, 'micro-properties') :
  createApplicationLogger(environment.NODE_ENV, 'micro-properties', environment.DATADOG_API_KEY);

export default logger;
