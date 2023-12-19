import {createApplicationLogger} from '@split-common/split-observability';

import {environment} from './environment';


const logger = (environment.NODE_ENV === 'development') ?
  createApplicationLogger(environment.NODE_ENV, 'micro-users') :
  createApplicationLogger(environment.NODE_ENV, 'micro-users', environment.DATADOG_API_KEY);

export default logger;
