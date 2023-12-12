import {createApplicationLogger} from '@split-common/split-observability';

import {environment} from './environment';

const logger = createApplicationLogger(environment.NODE_ENV, 'PROPERTIES');

export default logger;
